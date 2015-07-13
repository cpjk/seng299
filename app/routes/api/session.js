var express = require('express');
var passport = require('passport');
var User = require('../../models/user');
var nodemailer = require('nodemailer');
var router = express.Router();

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'averagejoesmembers@gmail.com',
    pass: 'mysupersecretpassword'
  }
});

// Try to log in with credentials provided in the request.
// Creates a new session for the user if successful
router.post('/login', passport.authenticate('local'), function(req, res){
  if(req.user.confirmed == "false"){
  	res.status(403).json({currentUser: req.user});
  }
  else {
  	res.json({currentUser: req.user});
  }
});

// Remove the session
router.post('/logout', function(req, res){
  req.logout();
  res.json({});
});

//send reset link
router.post('/forgot', function(req, res){
  User.findOne({ email: req.body.email }, function (err, user) {
    if(err){
      console.log(err);
    }
    if(!user) {
      console.log("cannot find email");
      res.status(404).json({success: false});
    }
    else if(user.confirmed == "false") {
      res.status(401).json({success: false});
    }
    else {
      var email = user.email;
      var key = user.key;
      host=req.get('host');
      link="http://"+req.get('host')+"/api/reset/"+key;
      var mailOptions = {
        to : email,
        subject : "Average Joe's Gym Password Reset Request",
        html : "Hello " + user.firstname + ", \
              <br> You are recieving this because you (or someon else) has requested the reset of the password of your account.\
              <br> Please click the following link, or paste this into your browser to complete the process:\
              <br> <a href="+link+">Click here to reset</a> \
              <br> If you did not request this, please ignore this email and your password will remain unchanged." 
      }
      transporter.sendMail(mailOptions, function(error){
        if(error){
          console.log(error);
        } else{
        }
      });
      res.status(200).json({success: true});
    }   
  });
});

// Try to log in with credentials provided in the request.
// Creates a new session for the user if successful
router.post('/reset', passport.authenticate('local'), function(req, res){
  res.json({currentUser: req.user});
});

// Return the current user. Returns currentUser as undefined if no current user
router.get("/", function(req, res){
  if(req.user){
    res.status(200).json({currentUser: req.user});
  }
  else{
    res.status(404).json({currentUser: req.user});
  }
});

module.exports = router;
