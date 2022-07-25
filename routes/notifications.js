const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const helpers = require("../helpers");
const upload = require("../config/multer").multerUpload;
const multerFields = require("../config/multer").multerFields;

router.get("/", helpers.isLogged, notificationController.getNotifications);

router.post("/read", helpers.isLogged, upload.fields(multerFields), notificationController.readNotifications);

module.exports = router;