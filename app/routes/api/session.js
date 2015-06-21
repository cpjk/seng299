var express = require('express');
var passport = require('passport');
var User = require('../../models/user');
var router = express.Router();

router.post('/login', passport.authenticate('local'), function(req, res){
  res.json({currentUser: req.user});
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
