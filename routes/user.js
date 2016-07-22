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

userRouter.get('/users', isLoggedIn, function(req, res) {
  User.find({}, function(err, users) {
    if(err) return console.log(err)
    res.render('users.ejs', {users: users})
  })
})

userRouter.post('/users/like/:id', function(req, res) {
  // find the currently logged in user
  User.findById(req.user._id, function(err, user) {
    if(err) return console.log(err)

    // add the id of the user that was liked, to the currently logged in user's 'likes' array...
    user.likes.push(req.params.id)


    // save the currently logged in user

    user.save(function(err) {
      console.log(String(user.likes[0]))
      User.findById(req.params.id, function(err, likedUser) {
        if(err) return console.log(err)
        for(var i = 0; i < likedUser.likes.length; i += 1) {
          if(String(likedUser.likes[i]) == String(req.user._id)) {
            return res.json({success: true, user: user, match: true})
            break;
          }
        }
        res.json({success: true, user: user, match: false})
      })
    })
  })
})

userRouter.get('/test-adriana', function(req, res){
  User.findById(req.user._id, function(err, user) {
    if(err) return console.log(err)
    for(var i = 0; i < user.likes.length; i += 1) {
      if(user.likes[i] == "579182864b60ecf94583bb27") {
        return res.json({message: 'user contains adriana'})
        break;
      }
    }
    res.json({message: 'user needs to try harder...'})
  })
})


function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next()
  res.redirect('/')
}

module.exports = userRouter
