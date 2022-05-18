const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const helpers = require("../helpers");

/* GET post */
router.get("/:id", helpers.isLogged, postController.getPost);

/* Render new post form */
router.get('/new', helpers.isLogged, (req, res, next) => {
    res.render("postForm");
});

/* Create new post */
router.post("/new", helpers.isLogged, postController.createPost);

router.get("/:id/like", helpers.isLogged, (req, res, next) => {
    res.render("likePostForm")
});

/* Comment on the post */
router.post("/:id/comments/new", helpers.isLogged, commentController.createPostComment);

router.get("/:id/comments/new", helpers.isLogged, (req, res) => {
    res.render("createPostComment");
});

/* Like a post */
router.post("/:id/like", helpers.isLogged, postController.likePost);

router.get("/:id/unlike", helpers.isLogged, (req, res) => {
    res.render("unlikePostForm");
});

/* Unlike a post */
router.post("/:id/unlike", helpers.isLogged, postController.unlikePost);

module.exports = router;