var express = require('express');
var router = express.Router();
var User = require('app/models/user')
var passport = require('passport');

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

// create new user and authenticate with passport
router.post('/', function(req, res, next){
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){

    if(err){
      res.json(err);
    }

    passport.authenticate('local')(req, res, function(){
      res.json({success: true});
    });
  });
});

module.exports = router;
