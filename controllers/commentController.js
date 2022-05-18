const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

exports.getComment = (req, res, next) => {
    Comment.findById(req.params.id)
        .then(comment => {
            Comment.find({parentComment: comment})
                .then(descendersComments => res.json({comment, descendersComments}))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.createPostComment = [
    body("text").isLength({max: 999}).trim().escape(),
    body("postID").exists(),

    (req, res, next) => {
        const errors = validationResult(req)
        const newComment = new Comment({
            user: req.user.id,
            post: req.body.postID,
            text: req.body.text
        });
        if(!errors.isEmpty()) {
            res.json(err);
        } else {
            newComment.save().then(comment => res.json(comment))
        }
    }
];

exports.createCommentComment = [
    body("text").isLength({max: 999}).trim().escape(),
    body("parentCommentID").exists(),

    (req, res, next) => {
        const errors = validationResult(req)
        const newComment = new Comment({
            user: req.user.id,
            parentComment: req.body.parentCommentID,
            text: req.body.text
        });
        if(!errors.isEmpty()) {
            res.json(err);
        } else {
            newComment.save().then(comment => res.json(comment))
        }
    }
];

exports.likeComment = (req, res, next) => {
    Comment.findByIdAndUpdate(req.body.id, {$push: {likes: req.user.id}})
		.then(doc => console.log("Comment liked."))
		.catch(err => console.log(err));
};

exports.unlikeComment = (req, res, next) => {
	Comment.findByIdAndUpdate(req.body.id, {$pull: {likes: req.user.id}})
		.then(doc => console.log("Comment unliked."))
		.catch(err => console.log(err));
};