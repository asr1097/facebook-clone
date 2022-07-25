const express = require('express');
const router = express.Router();
const helpers = require("../helpers");
const messageController = require("../controllers/messageController");
const upload = require("../config/multer").multerUpload;
const multerFields = require("../config/multer").multerFields;

router.get("/", helpers.isLogged, messageController.getMessages);

router.post("/read", helpers.isLogged, upload.fields(multerFields), messageController.readMessages);

module.exports = router;