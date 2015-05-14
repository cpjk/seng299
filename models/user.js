var mongoose = require('models/mongoose');

var userSchema = mongoose.Schema({
  name: String
})

var User = mongoose.model('User', userSchema);

module.exports = User;

