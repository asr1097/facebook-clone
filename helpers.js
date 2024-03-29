require("dotenv").config();
const mongoose = require("mongoose");
const Comment = require("./models/comment");
const User = require("./models/user");

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

exports.areFriends = (req, res, next) => {
   if(req.user.id === req.params.id) {next()}
   else{
       let areFriends = req.user.friendsList.includes(req.params.id);
       if(areFriends) {next();}
       else {throw new Error("You are not friends with this profile.")}
   }
}

exports.findChildComments = (parentCommentID) => {
    return Promise.resolve(Comment.find({parentComment: parentCommentID})
        .then(comments => {
            if(comments.length){
                let commentsID = [];
                comments.forEach(comment => commentsID.push(comment._id.toString()))
                return commentsID;
            } else {
                return false;
            }
        })
        .catch(err => console.log(err)))
};

exports.checkIfRegistered = (req, res, next) => {
    User.findOne("email", req.body.email)
        .then(user => {
            if (user !== null) {return res.sendStatus(501).catch(err => res.json(err))}
            else {next()};
        });
};

