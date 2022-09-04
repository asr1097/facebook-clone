require("dotenv").config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require("../models/user");
const axios = require("axios");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CB_URL,
    scope: [
      "email",
      "profile",
      "https://www.googleapis.com/auth/user.gender.read",
      "https://www.googleapis.com/auth/user.birthday.read",
      "https://www.googleapis.com/auth/user.addresses.read"
]
  },
  (accessToken, refreshToken, profile, cb) => {
    User.findOne({googleID: profile.id}).then(async(cred) => {
      if (!cred) {
        // The account at Google has not logged in to this app before.  Create a
        // new user record and associate it with the Google account.
        const response = await axios.get(`https://people.googleapis.com/v1/people/${profile.id}?personFields=birthdays,genders,addresses&access_token=${accessToken}`)
        let DOB = Date.now();
        if(response.data.birthdays[0].date) {
          let dateString = `${response.data.birthdays[0].date.day}/${response.data.birthdays[0].date.month}/${response.data.birthdays[0].date.year}`
          DOB = new Date(dateString);
        }
        const user = new User({
            googleID: profile.id,
            "name.first": profile.name.givenName,
            "name.last": profile.name.familyName,
            email: profile._json.email,
            gender: response.data.genders[0] ? response.data.genders[0].formattedValue : "Male",
            dateOfBirth: DOB,
            location: ""
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