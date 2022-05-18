const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const helpers = require("../helpers");

/* GET user profile */
router.get("/:id", helpers.isLogged, userController.getUser);

router.get("/", helpers.isLogged, (req, res, next) => {
    res.render("sendFriendRequest")
})

/* Send friend request */
router.post("/", helpers.isLogged, userController.sendFriendRequest);

module.exports = router;