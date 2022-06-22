const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const helpers = require("../helpers");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const folderName = `public/images/${req.user.id}`;
        if(fs.existsSync(path.join(__dirname, `../${folderName}`))) {cb(null, folderName)}
        else {fs.mkdir(path.join(__dirname, `../${folderName}`), (err) => {
            if(err) {console.log(err)}
            cb(null, folderName)
        })}
    },
    filename: function(req, file, cb) {
        const name = `${uuidv4()}${path.extname(file.originalname)}`;
        req.image = name;
        cb(null, name);
    }
});
const maxSize = 5 * 1024 * 1024;
const upload = multer({
    storage: storage,
    limits: {fileSize: maxSize}
});

/* Render new post form */
router.get('/new', helpers.isLogged, (req, res, next) => {
    res.render("postForm");
});

/* Create new post */
router.post("/new", helpers.isLogged, upload.single("imageField"), postController.createPost);

/* GET post */
router.get("/:id", helpers.isLogged, postController.getPost);

router.get("/:id/like", helpers.isLogged, (req, res, next) => {
    res.render("likePostForm")
});

/* Comment on the post */
router.post("/:id/comments/new", helpers.isLogged, commentController.createComment);

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