var
express = require('express'),
passport = require('passport'),
User = require('../app/models/user.js'),
userRouter = express.Router()

userRouter.route('/login')
.get(function(req, res){
  res.render('login', {flash: req.flash('loginMessage')})
  //simply render the login view
})

.post(passport.authenticate('local-login',{
  successRedirect: '/profile',
  failureRedirect: '/login'
}))

userRouter.route('/signup')
.get(function(req, res){
  res.render('signup', {flash: req.flash('signupMessage')})
})
.post(passport.authenticate('local-signup',{
  successRedirect: '/profile',
  failureRedirect: '/signup'
}))

userRouter.get('/profile', isLoggedIn, function(req, res){
  console.log("Inside of profile");
  console.log(req.query);
  res.render('profile', {user: req.user, strategy: req.query.strategy})
})

userRouter.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

userRouter.get('/profile', isLoggedIn, function(req, res){
  res.render('profile.ejs', {user: req.user, date: date})
})

userRouter.get('/profile/edit/:id', isLoggedIn, function(req, res) {
  User.findOne({_id: req.user._id}, req.body, function(err, user) {
    if(err) return console.log(err)
    res.render('edit-profile.ejs')
  })
})

userRouter.patch('/profile/edit/', function(req, res) {
  console.log(req.body)
  console.log("The info being updated:")
  console.log(req.body)
  User.findOneAndUpdate({_id: req.user._id}, req.body, function(err, user) {
  if(err) return console.log(err)
  res.redirect('/profile')
  })
})

userRouter.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email']}));

// handle the callback after facebook has authenticated the user
userRouter.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/profile',
    failureRedirect : '/login'
    }
  )
);




function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next()
  res.redirect('/')
}

module.exports = userRouter
