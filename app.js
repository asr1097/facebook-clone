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

const corsOptions = {
  origin: new RegExp("http://localhost:*"),
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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
    res.clearCookie("session");
    res.clearCookie("session.sig");
    res.clearCookie("FBClone_loggedIn");
    req.logout();
    res.redirect("http://localhost:3001");
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

module.exports = app;
