const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const helpers = require("../helpers");

router.get("/", helpers.isLogged, notificationController.getNotifications);

router.post("/read", helpers.isLogged, notificationController.readNotifications);

module.exports = router;