require("dotenv").config();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const User = require("../models/user");

passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENTID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: process.env.FB_CB_URL,
    profileFields: ["id", "email", "birthday", "gender", "location", "name"]
}, (accessToken, refreshToken, profile, cb) => {
    User.findOne({"fbID": profile.id}).then(user => {
        if(user) {return cb(null, user)}
        else {
            const newUser = new User({
                fbID: profile.id,
                email: profile._json.email,
                name: {
                    first: profile.name.givenName,
                    last: profile.name.familyName,
                },
                gender: profile._json.gender,
                dateOfBirth: profile._json.birthday,
                location: profile._json.location.name || ""
            })
            newUser.save().then(user => {return cb(null, user)}).catch(err => cb(err, null));
        }
    })}
));

