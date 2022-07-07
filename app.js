require("dotenv").config();
require("./config/passport-facebook");
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
const multer = require("multer");
const upload = multer();
const fs = require("fs");

const corsOptions = {
  origin: new RegExp("https://localhost:*"),
  credentials: true,
  exposedHeaders: ["Cross-Origin-Resource-Policy"]
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

const app = express();
const server = require("https").createServer({
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
}, app);
const io = require("socket.io")(server, {
  cors: {
    origin: new RegExp("localhost:*")
  }
});

let activeSockets = [];

io.use((socket, next) => {
  socket.userID = socket.handshake.auth.socketID;
  next();
})

io.on("connection", (socket) => {
  activeSockets.push({
    SID: socket.id,
    userID: socket.userID
  });

  socket.join(socket.userID)

  console.log("User connected: " + socket.userID)
  
  io.to(socket.userID).emit("activeUsers", activeSockets)

  socket.broadcast.emit("new connection", socket.userID)

  socket.on("message", (msg) => {
      console.log("Message sent from " + socket.userID + " to " + msg.to)
      console.log(msg.text)
  })

  socket.on("disconnect", () => {
    const indexOfSocket = activeSockets.findIndex(activeSocket => 
      activeSocket.userID === socket.userID);
    let discUser = activeSockets.splice(indexOfSocket, 1);
    socket.broadcast.emit("user disconnected", discUser[0].userID);
    console.log("User disconnected: " + discUser[0].userID)
  })
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.io = io;
  next();
})
app.use(cors(corsOptions));
app.use(helmet({
  crossOriginResourcePolicy: {policy: "cross-origin"},
}));
app.use(compression());

app.use(upload.array())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
  name: "session",
  keys: [process.env.COOKIE_KEY],
  maxAge: 24 * 60 * 60 * 1000 
}))

app.use(passport.initialize())
app.use(passport.session())

app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/profile", profileRoute);
app.use("/posts", postsRoute);
app.use("/comments", commentsRoute);
app.get("/logout", (req, res) => {
    req.session = null;
    res.clearCookie("loggedIn");
    req.logout();
    res.redirect("https://localhost:3001/facebook-clone-client");
  }
);

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
