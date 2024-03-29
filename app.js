require("dotenv").config();
require("./config/passport-facebook");
require("./config/passport-google");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require("cookie-session");
const logger = require('morgan');
const helmet = require("helmet");
const compression = require("compression");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const fs = require("fs");
const socketIOHandlers = require("./config/socketio-handlers");
const User = require("./models/user");

const corsOptions = {
  origin: new RegExp(`${process.env.CLIENT_ORIGIN}`),
  credentials: true,
  allowedHeaders: ["Cross-Origin-Resource-Policy", "Access-Control-Allow-Origin"],
  exposedHeaders: ["Cross-Origin-Resource-Policy", "Access-Control-Allow-Origin"]
}

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const indexRoute = require("./routes/index");
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
const postsRoute = require("./routes/posts");
const commentsRoute = require("./routes/comments");
const messagesRoute = require("./routes/messages");
const notificationsRoute = require("./routes/notifications");

const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: new RegExp(`${process.env.CLIENT_ORIGIN}`)
  }
});

io.use((socket, next) => {
  socket.userID = socket.handshake.auth.socketID;
  next();
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user)).catch(err => done(err, null));
});

app.use(cors(corsOptions));
app.use(helmet({
  crossOriginResourcePolicy: {policy: "cross-origin"},
}));
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
  name: "session",
  keys: [process.env.COOKIE_KEY],
  maxAge: 24 * 60 * 60 * 1000
}))

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.io = io;
  io.loggedUser = req.user;
  next();
})
socketIOHandlers(io);

app.use("/index", indexRoute);
app.use("/auth", authRoute);
app.use("/profile", profileRoute);
app.use("/posts", postsRoute);
app.use("/comments", commentsRoute);
app.use("/messages", messagesRoute);
app.use("/notifications", notificationsRoute);
app.get("/logout", (req, res) => {
    req.session = null;
    res.clearCookie("loggedIn");
    req.logout();
    res.redirect(`${process.env.CLIENT_URL}/`);
  }
);
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  
  // render the error page
  res.statusCode = err.status || 500;
  res.json({err: err.message});
});

module.exports = { app, server };
