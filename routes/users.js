var express = require('express');
var router = express.Router();
var User = require('models/user')

// users index page
router.get('/', function(req, res, next) {
  User.find({}, function(err, users){
    if (users == undefined){
      res.render('404');
    }
    else{
      res.render('users/index', { title: "Users", users: users});
    }
  });
});

// user show page
router.get('/:username', function(req, res, next) {
  var username = req.params.username;

  User.findOne({ username: username }, function(err, user) {
    if (user == undefined){
      res.render('404');
    }
    else{
      res.render('users/show', { title: "User page", user: user});
    }
  });
});

module.exports = router;
