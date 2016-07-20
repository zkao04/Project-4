var User = require('./models/user.js')
module.exports = function(app, passport) {

    // route for home page
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // route for login form
    app.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
      res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    // route for processing the login form
    // route for signup form
    app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
      res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    // route for processing the signup form

    // route for showing the profile page
    app.get('/profile', isLoggedIn, function(req, res) {
      if(req.user.email && req.user.age && req.user.gender) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
      } else {
        res.redirect('/profile/edit')
      }
    });

    app.get('/profile/edit/:id', isLoggedIn, function(req, res) {
      User.findOne({_id: req.user._id}, req.body, function(err, user) {
        if(err) return console.log(err)
        res.render('edit-profile.ejs')
      })
    })

    app.patch('/profile/edit', function(req, res) {
      console.log(req.body)
      console.log("The info being updated:")
      console.log(req.body)
      User.findOneAndUpdate({_id: req.user._id}, req.body, function(err, user) {
        if(err) return console.log(err)
        res.redirect('/profile')
      })

    })

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email']}));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/login'
        }
      )
    );

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
      }
    );

    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }));
// route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
      if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
        res.redirect('/');
    }
};
