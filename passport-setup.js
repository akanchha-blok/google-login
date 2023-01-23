const passport = require('passport')

const GoogleStrategy = require("passport-google-oauth2").Strategy

const users = {};




    passport.serializeUser((user , done) => {
    done(null , user);
    })
    passport.deserializeUser(function(user, done) {
    done(null, user);
    });

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback:true




}, function(request, accessToken, refreshToken, profile, done){

    const { id, emails } = profile;
    const user = { id, email: emails[0].value };
    users[id] = user;

    console.log("profile of user",profile)

    return done(null,user)

}
))