var mongoose = require('../../app/models/mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = mongoose.Schema({
  username: {type: String, index: {unique: true}},
  password: String,
  email: String,
  firstname: String,
  lastname: String,
  key: String,
  confirmed: String,
  permissions: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
