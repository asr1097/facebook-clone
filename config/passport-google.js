require("dotenv").config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require("../models/user");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CB_URL,
    scope: [ 'profile' ],
    state: true
  },
  (accessToken, refreshToken, profile, cb) => {
    User.findOne({"googleID": profile.id}).then(cred => {
      if (!cred) {
        // The account at Google has not logged in to this app before.  Create a
        // new user record and associate it with the Google account.
        const user = new User({
            googleID: profile.id,
            "name.full": profile.displayName
        })
        user.save().then(user => {return cb(null, user)}).catch(err => console.log(err))
      } else {
        // The account at Google has previously logged in to the app.  Get the
        // user record associated with the Google account and log the user in.
          return cb(null, cred);
      }
    }).catch(err => console.log(err));
  }
));