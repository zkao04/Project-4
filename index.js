var
  express = require('express'),
  app = express();
  PORT = process.env.PORT || 3000
  mongoose = require('mongoose'),
  passport = require('passport'),
  flash = require('connect-flash'),
  morgan = require('morgan'),
  cookieParser = require('cookie-parser')
  dotevn = require('dotenv').load({silent: true}),

mongoose.connect(process.env.DB_URL, function(err){
  if(err) return console.log(err);
  console.log("Connected to MongoDB (DatePage)");
})
