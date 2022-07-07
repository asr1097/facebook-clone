const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const fs = require("fs");
const { body, validationResult } = require("express-validator");

const isSameUser = (req, res, next) => {
	Post.findById(req.body.postID).then(post => {
		if(post.user.toString() === req.user.id) {next()}
		else{
			console.log("Post doesn't belong to logged user.")
		}
	})
}

exports.getPosts = (req, res, next) => {
    User.findById(req.user.id).then(loggedUser => {
        Post.find({$or: [{user: {$in: loggedUser.friendsList}}, {user: req.user.id}]})
			.sort([["date", "-1"]])
			.populate(["user", "comments"])
			.then(posts => {res.json({posts, id: req.user.id, user: req.user})})
    });
};

exports.getPost = (req, res, next) => {
	Post.findById(req.params.id)
		.populate(["user", "comments"])
		.then(post => {res.json(post)})
};

exports.createPost = [
	body("text").isLength({max: 999}).trim().escape(),

	(req, res, next) => {
		const errors = validationResult(req);
		const newPost = new Post({
			user: req.user.id,
			text: req.body.text,
			image: req.image ? `${req.user.id}/${req.image}` : ""
		});
		if(!errors.isEmpty()) {
				res.send("Text field must have maximum of 999 characters.")
		} else {
				newPost.save()
					.then(doc => {
						res.io.on("connection", socket => {
							socket.emit("new post", doc)
						})
						res.redirect("/")})
					.catch(err => console.log(err))
		}
	}
];

exports.editPost = [
	isSameUser,

	body("text").isLength({max: 999}).trim().escape(),
	body("postID").exists(),

	(req, res, next) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			res.send("Text field must have maximum of 999 characters.")
		} else {
			Post.findByIdAndUpdate(req.body.postID, {text: req.body.text})
				.then(editedPost => console.log("Post editted."))
				.catch(err => res.json(err))	
		};
	}
];

exports.deletePost = [
	isSameUser,

	body("postID").exists(),

	(req, res, next) => {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			res.send("Post ID does not exist.")
		} else {
			Post.findById(req.body.postID).then(post => {
				/* Delete image file if any */
				if(post.image) {fs.unlinkSync(`public/images/${req.user.id}/${post.image}`)};

				Promise.all([
					Comment.deleteMany({post: post._id}),
					Post.findByIdAndDelete(req.body.postID)
				]).then(done => console.log("Post deleted.")).catch(err => console.log(err))
			})
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