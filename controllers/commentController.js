const Comment = require("../models/comment");
const helpers = require("../helpers");
const { body, validationResult } = require("express-validator");

const isSameUser = (req, res, next) => {
	Comment.findById(req.body.commentID).then(comment => {
		if(comment.user.toString() === req.user.id) {next()}
		else{
			console.log("Comment doesn't belong to logged user.")
		}
	})
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

    (req, res, next) => {
        const errors = validationResult(req)
        const newComment = new Comment({
            user: req.user.id,
            post: req.body.postID,
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
        Comment.deleteMany({_id: {$in: commentsToDelete}})
            .then(deletedComments => console.log(deletedComments))
            .catch(err => console.log(err));
    }
    
]

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