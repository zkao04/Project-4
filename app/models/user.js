var
  mongoose = require('mongoose'),
  bcrypt   = require('bcrypt-nodejs'),
  // define the schema for our user model
  userSchema = mongoose.Schema({

    local: {
      firstName: {
        type: String,
        required: true
      },
      lastName: String,
      email: String,
      age: Number,
      gender: String,
      password: String,
    },

    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },

    email: String,
    age: Number,
    gender: String,
    avatarUrl: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  });

// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
