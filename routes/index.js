const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");

const isLogged = (req, res, next) => {
  if(!req.user) {res.json({msg: "You are not loggeed in"})}
  next();
}

/* GET home page. */
router.get('/', isLogged, postController.getPosts);

router.get('/newPost', isLogged, (req, res, next) => {
  res.render("postForm");
});

/* Create post */
router.post("/", isLogged, postController.createPost);

module.exports = router;
