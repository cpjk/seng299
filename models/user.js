var mongoose = require('models/mongoose');

var userSchema = mongoose.Schema({
  username: String
})

var User = mongoose.model('User', userSchema);

module.exports = User;

