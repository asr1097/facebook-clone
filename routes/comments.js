const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const helpers = require("../helpers");

/* Get a comment */
router.get("/:id", helpers.isLogged, commentController.getComment);

router.get("/:id/new", helpers.isLogged, (req, res) => res.render("createCommentComment"));

/* Comment on a comment */
router.post("/:id/new", helpers.isLogged, commentController.createComment);

/* Like a comment */
router.post("/:id/like", helpers.isLogged, commentController.likeComment);
router.get("/:id/like", (req, res) => res.render("likeCommentComment"));

/* Unlike a comment */
router.post("/:id/unlike", helpers.isLogged, commentController.unlikeComment);
router.get("/:id/unlike", (req, res) => res.render("unlikeCommentComment"));

module.exports = router;