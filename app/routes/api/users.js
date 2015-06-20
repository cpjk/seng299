var express = require('express');
var router = express.Router();
var User = require('app/models/user')

// users index page
router.get('/', function(req, res, next){
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
router.get('/:username', function(req, res, next){
  var username = req.params.username;

  User.findOne({username: username}, function(err, user){
    if(err){
      res.send(err);
    }
    else{
      res.json({user: user});
    }
  });
});

// create new user
router.post('/', function(req, res, next){
  var user = new User;
  user.username = req.body.username;

  user.save(function(err){
    if(err){
      if(err.code == 11000){
        res.json({success: false, message: "That username is already taken :("});
      }
      else{
        res.json({success: false, message: "There was an error with code" + err.code});
      }
    }
    else{
      res.json({success: true, message: "User successfully created!"});
    }
  });
});

module.exports = router;
