const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");
const helpers = require("../helpers");

/* GET home page. */
router.get('/', helpers.isLogged, postController.getPosts);

module.exports = router;
