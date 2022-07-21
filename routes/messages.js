const express = require('express');
const router = express.Router();
const helpers = require("../helpers");
const messageController = require("../controllers/messageController");
const multer = require("multer");
const upload = multer();

router.get("/", helpers.isLogged, messageController.getMessages);

router.post("/read", helpers.isLogged, upload.single("readMessages"), messageController.readMessages);

module.exports = router;