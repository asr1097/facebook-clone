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

/* Create new post */
router.post("/new", helpers.isLogged, upload.single("imageField"), postController.createPost);

/* GET post */
router.get("/:id", helpers.isLogged, postController.getPost);

/* Comment on the post */
router.post("/:id/comments/new", helpers.isLogged, commentController.createComment);

router.post("/:id/delete", helpers.isLogged, postController.deletePost);

/* Like a post */
router.post("/:id/like", helpers.isLogged, upload.single("id"), postController.likePost);

/* Unlike a post */
router.post("/:id/unlike", helpers.isLogged, upload.single("id"), postController.unlikePost);

module.exports = router;