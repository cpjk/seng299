var User = require('models/user')

var index = function(req, res, next) {
  res.send('respond with a resource');
}

var userController = {
  index: index
}

module.exports = userController;
