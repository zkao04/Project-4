var
  express = require('express'),
  mongoose = require('mongoose'),
  dotevn = require('dotenv').load({silent: true}),
  PORT = process.env.PORT || 3000

mongoose.connect(process.env.DB_URL, function(err){
  if(err) return console.log(err);
  console.log("Connected to MongoDB (DatePage)");
})
