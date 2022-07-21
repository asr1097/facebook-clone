const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const helpers = require("../helpers");
const multer = require("multer");
const upload = multer();

router.get("/", helpers.isLogged, notificationController.getNotifications);

router.post("/read", helpers.isLogged, upload.single("notifs"), notificationController.readNotifications);

module.exports = router;