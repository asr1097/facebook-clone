const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const helpers = require("../helpers");
const multer = require("multer");
const upload = multer();


router.get("/loggedUser", helpers.isLogged, userController.getLoggedUser);

/* GET user profile */
router.get("/:id", helpers.isLogged, userController.getUser);

/* Send friend request */
router.post("/friends/add", helpers.isLogged, userController.sendFriendRequest);
router.get("/:id/add", helpers.isLogged, (req, res, next) => {
    res.render("sendFriendRequest")
})

/* Accept friend request */
router.post("/friends/accept", helpers.isLogged, userController.acceptFriendRequest);
router.get("/:id/accept", helpers.isLogged, (req, res, next) => {
    res.render("acceptRequest")
})

/* Reject friend request */
router.post("/friends/reject", helpers.isLogged, userController.rejectFriendRequest);
router.get("/:id/reject", helpers.isLogged, (req, res, next) => {
    res.render("rejectRequest")
})

/* Cancel friend request */
router.post("/friends/cancel", helpers.isLogged, userController.cancelFriendRequest);
router.get("/:id/cancel", helpers.isLogged, (req, res, next) => {
    res.render("cancelRequest")
})

/* Remove friend */
router.post("/friends/remove", helpers.isLogged, userController.removeFriend);
router.get("/:id/remove", helpers.isLogged, (req, res, next) => {
    res.render("removeFriend")
})

/* Delete account */
router.post("/:id/delete", helpers.isLogged, userController.deleteUser)
router.get("/:id/delete", helpers.isLogged, (req, res) => res.render("deleteUser"))

/* Search for users */
router.post("/search", helpers.isLogged, upload.single("name"), userController.searchUsers);

module.exports = router;