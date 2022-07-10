const express = require('express');
const router = express.Router();
const helpers = require("../helpers");
const messageController = require("../controllers/messageController");

router.get("/", helpers.isLogged, messageController.getMessages);

router.post("/read", helpers.isLogged, messageController.readMessages);

module.exports = router;