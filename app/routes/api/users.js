var express = require('express');
var router = express.Router();
var User = require('app/models/user')

// users index page
router.get('/', function(req, res, next) {
  User.find({}, function(err, users){
    if(err){
      res.send(err);
    }
    else{
      res.json({
        users: users
      });
    }
  });
});

// user show page
router.get('/:username', function(req, res, next) {
  var username = req.params.username;

  User.findOne({ username: username }, function(err, user) {
    if(err){
      res.send(err);
    }
    else{
      res.json({user: user});
    }
  });
});

module.exports = router;
