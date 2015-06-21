var express = require('express');
var passport = require('passport');
var User = require('../../models/user');
var router = express.Router();

// Try to log in with credentials provided in the request.
// Creates a new session for the user if successful
router.post('/login', passport.authenticate('local'), function(req, res){
  res.json({currentUser: req.user});
});

// Remove the session
router.post('/logout', function(req, res){
  req.logout();
  res.json({});
});

router.get("/", function(req, res){
  if(req.user){
    res.status(200).json({currentUser: req.user});
  }
  else{
    res.status(404).json({currentUser: req.user});
  }
});

module.exports = router;
