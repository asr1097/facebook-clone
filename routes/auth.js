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

module.exports = router;