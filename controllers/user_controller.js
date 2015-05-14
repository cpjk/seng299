var User = require('models/user')

var index = function(req, res, next) {
  res.send('respond with a resource');
}

var show = function(req, res, next) {
  var id = req.params.id;

  var user = User.findOne({ id: id });

  res.render('users/show', { title: "User page", id: id });
}

var userController = {
  index: index,
  show: show
}

module.exports = userController;
