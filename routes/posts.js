const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const helpers = require("../helpers");
const upload = require("../config/multer").multerUpload;
const multerFields = require("../config/multer").multerFields;

/* Create new post */
router.post("/new", helpers.isLogged, upload.fields(multerFields), postController.createPost);

/* GET post */
router.get("/:id", helpers.isLogged, postController.getPost);

/* Comment on the post */
router.post("/:id/comments/new", helpers.isLogged, upload.fields(multerFields), commentController.createComment);

router.post("/:id/delete", helpers.isLogged, postController.deletePost);

/* Like a post */
router.post("/:id/like", helpers.isLogged, upload.fields(multerFields), postController.likePost);

/* Unlike a post */
router.post("/:id/unlike", helpers.isLogged, upload.fields(multerFields), postController.unlikePost);

module.exports = router;