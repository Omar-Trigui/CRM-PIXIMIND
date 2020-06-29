const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const key = require("./keys");
const User = require("../model/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
passport.use(
  new GoogleStrategy(
    {
      clientID: key.google.clientID,
      clientSecret: key.google.clientSecret,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user already exists in our db
      User.findOne({ email: profile.emails[0].value })
        .then((currentUser) => {
          if (currentUser) {
        
            done(null, currentUser);
          } else {
            new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              profileImage: profile.photos[0].value,
            })
              .save()
              .then((user) => {
                done(null, user);
              });
          }
        })
        .catch((err) => {
          if (err) {
            console.log(err);
          }
        });
    }
  )
);
