var express = require('express');
var router = express.Router();
var User = require('../../../app/models/user')
var passport = require('passport');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'averagejoesmembers@gmail.com',
    pass: 'mysupersecretpassword'
  }
});

router.get('/:uid',function(req,res){
  var key = req.params.uid;
  host=req.get('host');
  User.findOne({key: key}, function(err, user){
  if((req.protocol+"://"+req.get('host'))==("http://"+host)){
    if(err){
      res.redirect('/sorry');
    } else{
      if(!user){
        res.redirect("/sorry");
        return;
      }
      user.confirmed = "true";
      user.save();
      res.redirect("/verify");
    }
  } else{
    res.redirect("/sorry");
  }
  });
});

// send confirmation email to user with key
router.get('/resend/:hash', function(req, res){
  var hash = req.params.hash;
  User.findOne({key: hash}, function(err, user){
    var key = user.key;
    var email = user.email;
    host=req.get('host');
    link="http://"+req.get('host')+"/api/verify/"+key;
    var mailOptions = {
      to : email,
      subject : "Please confirm your Email account",
      html : "Hello "+user.firstname+",<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
    }
    transporter.sendMail(mailOptions, function(error){
      if(error){
        console.log(error);
      } else{
        res.redirect("/confirm");
      }
    });
  });
});

module.exports = router;
