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
        .populate("user")
        .populate("likes")
        .then(comment => {
            Comment.find({_id: {$in: comment.childrenComments}})
                .populate(["user", "likes"])
                .sort({"date": "desc"})
                .then(childrenComments => {
                    res.json({comment, childrenComments})
                })
        })
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
            date: Date.now()
        });
        if(req.body.parentCommentID) {newComment.parentComment = req.body.parentCommentID}
        if(!errors.isEmpty()) {
            res.json(err);
        } else {
            newComment.save().then(comment => {
                req.comment = comment;
                if(!req.body.parentCommentID){
                    Post.findByIdAndUpdate(req.body.postID, {$push: {comments: comment._id, directComments: comment._id}})
                        .then(post => next())
                } else {
                    Promise.all([
                        Post.findByIdAndUpdate(req.body.postID, {$push: {comments: comment._id}}),
                        Comment.findByIdAndUpdate(req.body.parentCommentID, {$push: {childrenComments: comment._id}})
                    ])
                        .then(post => next())
                }
            })
        }
    },

    (req, res, next) => {
        if(req.user.id === req.body.user){
            req.comment.populate("user").then(populatedComment => {
                res.status(200).json(populatedComment)
            })
        }
        else {
            const newNotification = new Notification({
                user: req.body.user,
                profileID: req.user.id,
                date: Date.now(),
                newCommentID: req.comment._id,
                postID: req.body.postID,
            })
            if(req.body.parentCommentID) {
                newNotification.parentCommentID = req.body.parentCommentID;
                newNotification.type = "comment comment";
            } else {
                newNotification.type = "post comment"
            }
            newNotification.save().then(notif => {
                Promise.all([
                    notif.populate(["user", "profileID", "newCommentID", "postID", "parentCommentID"]),
                    req.comment.populate("user")
                ])
                    .then(response => {
                        if(res.io.sockets.adapter.rooms.has(req.body.user)) {
                            res.io.to(req.body.user).emit("new notification", response[0]);
                            res.status(200).json(response[1])
                        } else{res.status(200).json(response[1])}
                    })
                    .catch(err => console.log(err))
            }).catch(err => console.log(err))
        };
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
            Post.findByIdAndUpdate(req.body.postID, {$pull: {comments: {$in: commentsToDelete}, directComments: {$in: commentsToDelete}}}),
            
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
        if(req.user.id === req.comment.user._id.toString()){res.sendStatus(200)}
        else {
            const newNotification = new Notification({
                user: req.comment.user,
                profileID: req.user.id,
                commentID: req.comment._id,
                date: Date.now(),
                type: "liked comment"
            });
            newNotification.save().then(notif => {
                notif.populate(["user", "profileID", "commentID"]).then(populatedNotif => {
                    if(res.io.sockets.adapter.rooms.has(req.comment.user._id.toString())) {
                        res.io.to(req.comment.user._id.toString()).emit("new notification", populatedNotif);
                        res.sendStatus(200);
                    } else {res.sendStatus(200)}
                })
            }).catch(err => console.log(err))
        }
    }
]


exports.unlikeComment = (req, res, next) => {
	Comment.findByIdAndUpdate(req.body.id, {$pull: {likes: req.user.id}})
		.then(doc => res.sendStatus(200))
		.catch(err => console.log(err));
};