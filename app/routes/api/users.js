var express = require('express');
var router = express.Router();
var User = require('../../../app/models/user')
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
    else{
      passport.authenticate('local')(req, res, function(){
        res.json({success: true});
      });
    }
  });
});

router.delete('/:username', function(req, res, next){
  var username = req.params.username;

  // permissions checking can go here

  User.findOne({username: username}, function(err, user){
    if(err){
      res.send(err);
    }
    else{
      if(!user){
        // the given user does not exist
        res.status(404).send();
      }
      else{
        if(req.user.username == user.username){
          // The current user has been deleted. Log them out.
          req.logout();
          res.status(200);
        }
        else{
          res.status(204);
        }
        user.remove(err);
        res.send();
      }
    }
  });
});

module.exports = router;
