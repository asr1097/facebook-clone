const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const helpers = require("../helpers");
const upload = require("../config/multer").multerUpload;
const multerFields = require("../config/multer").multerFields;

router.get("/loggedUser", helpers.isLogged, userController.getLoggedUser);

/* GET user profile */
router.get("/:id", helpers.isLogged, userController.getUser);

/* Send friend request */
router.post("/friends/add", helpers.isLogged, userController.sendFriendRequest);

/* Accept friend request */
router.post("/friends/accept", helpers.isLogged, upload.fields(multerFields), userController.acceptFriendRequest);

/* Reject friend request */
router.post("/friends/reject", helpers.isLogged, userController.rejectFriendRequest);

/* Cancel friend request */
router.post("/friends/cancel", helpers.isLogged, userController.cancelFriendRequest);

/* Remove friend */
router.post("/friends/remove", helpers.isLogged, userController.removeFriend);

/* Delete account */
router.post("/:id/delete", helpers.isLogged, userController.deleteUser)

/* Search for users */
router.post("/search", helpers.isLogged, upload.fields(multerFields), userController.searchUsers);

router.get("/:id/photos", helpers.isLogged, userController.getPhotos);

module.exports = router;