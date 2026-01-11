const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  passwordChangedDate:Date,
  registrationDate:Date,
  verificationDate:Date,
  verificationToken:String,
  isAdmin:Boolean,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
