const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  passwordChangedDate:Date,
  registrationDate:Date,
  registerToken:String,
  verificationDate:Date,
  isAdmin:Boolean,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
