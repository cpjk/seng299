var express = require('express');
var passport = require('passport');
var User = require('../../models/user');
var router = express.Router();

router.post('/login', passport.authenticate('local'), function(req, res){
  res.json({});
});

module.exports = router;
