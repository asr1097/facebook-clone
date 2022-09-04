require("dotenv").config();
const express = require('express');
const router = express.Router();
const passport = require("passport");

router.get("/facebook", passport.authenticate("facebook", {
    scope: ["email", "user_gender", "user_location", "user_birthday"]
}));
   
router.get("/facebook/redirect", passport.authenticate("facebook", { failureRedirect: '/auth/facebook', failureMessage: true }),
 (req, res, next) => {
    res.cookie("loggedIn", true);
    res.redirect(process.env.CLIENT_URL);
});

router.get("/google", passport.authenticate("google", {
	scope: [
		"email", 
		"profile",
		"https://www.googleapis.com/auth/user.gender.read",
		"https://www.googleapis.com/auth/user.birthday.read",
		"https://www.googleapis.com/auth/user.addresses.read"
	]
}));

router.get("/google/redirect", passport.authenticate("google", {failureRedirect: "/auth/google", failureMessage: true}), 
	(req, res, next) => {
		res.cookie("loggedIn", "google");
		res.redirect(process.env.CLIENT_URL);
	}
);

module.exports = router;