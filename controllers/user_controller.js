var User = require('models/user')

var index = function(req, res, next) {
  res.send('respond with a resource');
}

var show = function(req, res, next) {
  var username = req.params.username;

  User.findOne({ username: username }, function(err, user) {
    if (user == undefined){
      res.render('404');
    }
    else{
      res.render('users/show', { title: "User page", user: user});
    }
  });
}

var userController = {
  index: index,
  show: show
}

module.exports = userController;
