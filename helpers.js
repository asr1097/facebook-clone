const mongoose = require("mongoose");
const Comment = require("./models/comment");

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

exports.isLogged = (req, res, next) => {
    if(!req.user) {
        res.redirect("/auth/facebook")
    }
    next();
};

exports.findChildComments = (parentCommentID) => {
    Comment.find({parentComment: parentCommentID})
    .then(comments => {
        if(comments.length){
            return comments;
        } else {
            return false;
        }
    })
    .catch(err => console.log(err))
}

