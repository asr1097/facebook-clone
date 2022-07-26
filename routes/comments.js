const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const helpers = require("../helpers");
const upload = require("../config/multer").multerUpload;
const multerFields = require("../config/multer").multerFields;

/* Get a comment */
router.get("/:id", helpers.isLogged, commentController.getComment);

router.get("/:id/new", helpers.isLogged, (req, res) => res.render("createCommentComment"));

/* Comment on a comment */
router.post("/:id/new", helpers.isLogged, upload.fields(multerFields), commentController.createComment);

router.get("/:id/delete", helpers.isLogged, (req, res) => res.render("deleteComment"));
router.post("/:id/delete", helpers.isLogged, commentController.deleteComment);

/* Like a comment */
router.post("/:id/like", helpers.isLogged, upload.fields(multerFields), commentController.likeComment);

/* Unlike a comment */
router.post("/:id/unlike", helpers.isLogged, upload.fields(multerFields), commentController.unlikeComment);

module.exports = router;