const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
    User.findById(req.user.id).then(loggedUser => {
        Post.find({user: {$in: loggedUser.friendsList}})
          .populate("user")
          .populate("comments")
          .then(posts => res.json(posts));
    });
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
]