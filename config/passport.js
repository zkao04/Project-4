var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var User = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');


    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
            done(err, user);
      });
    })

    passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, function(req, email, password, done) {
          process.nextTick(function(){
            User.findOne({ 'local.email': email }, function(err, user) {
              if (err)
                return done(err);
              if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken'))
              } else {
                var newUser = new User();
                //setting user's local credentials
                console.log(req.body);
                newUser.local.firstName = req.body.firstName
                newUser.local.lastName = req.body.lastName
                newUser.local.email = email;
                newUser.local.age = req.body.age;
                newUser.local.gender = req.body.gender;
                newUser.local.password = newUser.generateHash(password);
                newUser.save(function(err) {
                  if(err)
                    throw err;
                  return done(null, newUser);
                })
              }
            })
          })
    }));

    passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },

    function(req, email, password, done) {
      User.findOne({ 'local.email' : email }, function(err, user) {
        if (err)
          return done(err);
        if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));

        if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

        return done(null, user);
      });
    }));
    passport.use(new FacebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL
    },
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        // asynchronous
      process.nextTick(function() {
            // find the user in the database based on their facebook id
        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
          if (err)
              return done(err);
                // if the user is found, then log them in
          if (user) {
            console.log(user);
              return done(null, user); // user found, return that user
          } else {
              // if there is no user found with that facebook id, create them
              var newUser = new User();
                    // console.log(profile)
                    // set all of the facebook information in our user model
                newUser.facebook.id    = profile.id; // set the users facebook id
                newUser.facebook.token = token; // we will save the token that facebook provides to the user
                newUser.facebook.name  = profile.displayName; // look at the passport user profile to see how names are returned
                    // newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                newUser.save(function(err) {
                  if (err)
                    throw err;
                        // if successful, return the new user
                    return done(null, newUser);
                  });
                }
            });
        });
    }));
module.exports = passport
