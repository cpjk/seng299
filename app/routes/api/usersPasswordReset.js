var express = require('express');
var router = express.Router();
var User = require('../../../app/models/user')
var passport = require('passport');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'averagejoesmembers@gmail.com',
    pass: 'mysupersecretpassword'
  }
});

router.get('/:key',function(req,res){
  var password = crypto.randomBytes(10).toString('hex');
  var key = req.params.key;
  host=req.get('host');
  User.findOne({key: key}, function(err, user){
  if((req.protocol+"://"+req.get('host'))==("http://"+host)){
    if(err){
      res.redirect('/sorry');
    } else{
      if(user == null){
        res.redirect("/sorry");
        return;
      }
      user.setPassword(password,function(error){
        if (!error) {
          user.save(function(error){
            if (error) {
              console.log(error)
            }
          });
        }
        else {
          console.log(error)
        }
      });
      host=req.get('host');
      var mailOptions = {
        to : user.email,
        subject : "Average Joe's Password Retrieval",
        html : "Hello "+user.firstname+",<br> Your password is: " + password + "\
              <br> Use this password to log in and please reset your password." 
      }
      transporter.sendMail(mailOptions, function(error){
        if(error){
          console.log(error);
        }
      });
      res.render('layout');
    }
  } else{
    res.redirect("/sorry");
  }
  });
  res.redirect("/reset")
});

module.exports = router;
