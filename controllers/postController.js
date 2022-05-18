const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
    User.findById(req.user.id).then(loggedUser => {
        Post.find({$or: [{user: {$in: loggedUser.friendsList}}, {user: req.user.id}]})
        	.populate("user")
        	.then(posts => {
			  Comment.find({post: {$in: posts}})
			  	.then(comments => res.json({posts, comments}))
				.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
    });
};

exports.getPost = (req, res, next) => {
	Post.findById(req.params.id)
		.populate("user")	
		.then(post => res.json(post))
};

exports.createPost = [
	body("text").isLength({max: 999}).trim().escape(),

	(req, res, next) => {
		const errors = validationResult(req);
		const newPost = new Post({
			user: req.user.id,
			text: req.body.text
		});
		if(!errors.isEmpty()) {
				res.send("Text field must have maximum of 999 characters.")
		} else {
				newPost.save()
					.then(doc => res.redirect("/"))
					.catch(err => console.log(err))
		}
	}
];

exports.likePost = (req, res, next) => {
	Post.findByIdAndUpdate(req.body.id, {$push: {likes: req.user.id}})
		.then(doc => console.log("Post liked."))
		.catch(err => console.log(err));
};

exports.unlikePost = (req, res, next) => {
	Post.findByIdAndUpdate(req.body.id, {$pull: {likes: req.user.id}})
		.then(doc => console.log("Post unliked."))
		.catch(err => console.log(err));
};