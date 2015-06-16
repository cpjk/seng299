var mongoose = require('app/models/mongoose');

var userSchema = mongoose.Schema({
  username: String,
  hashed_password: String
})

var User = mongoose.model('User', userSchema);

module.exports = User;

