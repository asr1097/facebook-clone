const Comment = require("../models/comment");
const Notification = require("../models/notification");
const Post = require("../models/post");
const helpers = require("../helpers");
const { body, validationResult } = require("express-validator");

const isSameUser = (req, res, next) => {
	Comment.findById(req.body.commentID).then(comment => {
		if(comment.user.toString() === req.user.id) {next()}
		else{
			console.log("Comment doesn't belong to logged user.")
		}
	}).catch(err => console.log(err))
}

exports.getComment = (req, res, next) => {
    Comment.findById(req.params.id)
        .then(comment => {
            Comment.find({parentComment: comment})
                .then(descendersComments => res.json({comment, descendersComments}))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.createComment = [
    body("text").isLength({max: 999}).trim().escape(),
    body("postID").exists(),
    body("user").exists(),

    (req, res, next) => {
        const errors = validationResult(req)
        const newComment = new Comment({
            user: req.user.id,
            post: req.body.postID,
            text: req.body.text,
        });
        if(req.body.parentCommentID) {newComment.parentComment = req.body.parentCommentID}
        if(!errors.isEmpty()) {
            res.json(err);
        } else {
            newComment.save().then(comment => {
                Post.findByIdAndUpdate(req.body.postID, {$push: {comments: comment._id}})
                    .then(post => next())
            })
        }
    },

    (req, res, next) => {
        const newNotification = new Notification({
            user: req.body.user,
            profileID: req.user.id,
            date: Date.now()
        })
        if(req.body.parentCommentID) {
            newNotification.commentID = req.body.parentCommentID;
            newNotification.type = "comment comment";
        } else {
            newNotification.postID = req.body.postID;
            newNotification.type = "post comment"
        }
        newNotification.save().then(notif => {
            if(res.io.sockets.adapter.rooms.has(req.body.user)) {
                res.io.to(req.body.user).emit("new notification", notif);
                res.sendStatus(200)
            } else{res.sendStatus(200)}
        }).catch(err => console.log(err))
    }
];

exports.editComment = [
    isSameUser,

    body("text").isLength({max: 999}).trim().escape(),
    body("postID").exists(),
    body("commentID").exists(),

    (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            res.json(err);
        } else {
            Comment.findByIdAndUpdate(req.body.commentID, {text: req.body.text})
                .then(newComment => console.log("Comment edited."))
                .catch(err => res.json(err));
        };
    }
]

exports.deleteComment = [
    isSameUser,

    body("text").isLength({max: 999}).trim().escape(),
    body("postID").exists(),
    body("commentID").exists(),

    async (req, res, next) => {
        let commentsToDelete = [req.body.commentID];
        for(let i = 0; i < commentsToDelete.length; i++) {
            let comments = await helpers.findChildComments(commentsToDelete[i]);
            if(comments){
                let newCommentsToDelete = [...commentsToDelete, ...comments];
                commentsToDelete = newCommentsToDelete
            };          
        }
        Promise.all([
            Post.findByIdAndUpdate(req.body.postID, {$pull: {comments: {$in: commentsToDelete}}}),
            
            Comment.deleteMany({_id: {$in: commentsToDelete}})
            ])
                .then(done => console.log(done))
                .catch(err => console.log(err))
    }
    
]

exports.likeComment = [

    (req, res, next) => {
        Comment.findByIdAndUpdate(req.body.id, {$push: {likes: req.user.id}})
            .then(doc => {
                req.comment = doc;
                next()
            })
            .catch(err => console.log(err));
    },

    (req, res, next) => {
        const newNotification = new Notification({
            user: req.comment.user,
            profileID: req.user.id,
            commentID: req.comment._id,
            date: Date.now(),
            type: "liked comment"
        }).then(notif => {
            if(res.io.sockets.adapter.rooms.has(req.comment.user)) {
                res.io.to(req.comment.user).emit("new notification", notif);
                res.sendStatus(200);
            } else {res.sendStatus(200)}
        }).catch(err => console.log(err))
    }
]


exports.unlikeComment = (req, res, next) => {
	Comment.findByIdAndUpdate(req.body.id, {$pull: {likes: req.user.id}})
		.then(doc => console.log("Comment unliked."))
		.catch(err => console.log(err));
};