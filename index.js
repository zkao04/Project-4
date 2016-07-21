var
  express = require('express'),
  app = express(),
  PORT = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  passport = require('passport'),
  flash = require('connect-flash'),
  ejs = require('ejs'),
  ejsLayouts = require('express-ejs-layouts'),
  morgan = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  session = require('express-session'),
  configDB = require('./config/database.js'),
  dotenv = require('dotenv').load({silent: true}),
  passportConfig = require('./config/passport'),
  aws = require('aws-sdk'),
  routes = require('./routes/user.js')

const S3_BUCKET = process.env.S3_BUCKET

mongoose.connect(process.env.DB_URL, function(err){
  if(err) return console.log(err);
  console.log("Connected to MongoDB (DatePage)");
})



// set up our express application
app.use(express.static('./public'))
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(methodOverride(function(req, res){ //allows for PATCH requests in form submissions
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.set('view engine', 'ejs'); // set up ejs for templating
app.use(ejsLayouts)
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function(req, res, next) {
  app.locals.currentUser = req.user || null
  next()
})

var params;

app.get('/sign-s3', function(req, res) {
 var
   s3 = new aws.S3(),
   fileName = req.query['file-name'],
   fileType = req.query['file-type'],
   s3Params = {
     Bucket: S3_BUCKET,
     Key: fileName,
     Expires: 60,
     ContentType: fileType,
     ACL: 'public-read'
   }

   params = {
     Bucket: S3_BUCKET,
     Key: fileName
   }

 s3.getSignedUrl('putObject', s3Params, function(err, data) {
   if(err){
     console.log(err)
     return res.end()
   }
   var returnData = {
     signedRequest: data,
     url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + fileName
   }
   res.write(JSON.stringify(returnData));
   res.end();
 })
})

app.get('/', function(req, res) {
  res.render('index.ejs')
})

app.use('/', routes)

app.post('/upload', function(req, res) {
 res.json({message: "POSTED", body: req.body})
})

// routes ======================================================================
// require('./app/routes.js')(app, passport);
// load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(PORT);
console.log('The magic happens on port ' + PORT);
