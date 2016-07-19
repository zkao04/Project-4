var
  express = require('express'),
  app = express();
  PORT = process.env.PORT || 3000
  mongoose = require('mongoose'),
  passport = require('passport'),
  flash = require('connect-flash'),
  morgan = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  configDB = require('./config/database.js'),
  dotevn = require('dotenv').load({silent: true}),
  passportConfig = require('./config/passport')

mongoose.connect(process.env.DB_URL, function(err){
  if(err) return console.log(err);
  console.log("Connected to MongoDB (DatePage)");
})



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport);
// load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(PORT);
console.log('The magic happens on port ' + PORT);
