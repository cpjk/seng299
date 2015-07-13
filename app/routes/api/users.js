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

//create confirmed test user acount
User.findOne({ username: 'joetester' }, function (err, user) {
  if(err){
    console.log(err);
  }
  if(!user){
    User.register(new User({
      username: 'joetester',
      firstname: 'Joe',
      lastname: 'Smith',
      email: 'averagejoe@averageemail.com',
      confirmed: 'true',
      permissions: 'user'
    }), 'joetester', function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
});

//create admin acount
User.findOne({ username: 'admin' }, function (err, user) {
  if(err){
    console.log(err);
  }
  if(!user){
    User.register(new User({
      username: 'admin',
      firstname: 'admin',
      lastname: 'admin',
      email: 'averagejoesmembers@gmail.com',
      confirmed: 'true',
      permissions: 'admin'
    }), 'admin', function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
});

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

  if( req.user && (req.user.username == username || req.user.permissions == "admin") ){
    User.findOne({username: username})
    .populate('bookings')
    .exec(function(err, user){
      if(err){
        res.send(err);
      }
      else{
        var opts = {
          path: 'bookings.bookable',
          model: 'Bookable'
        };
        User.populate(user, opts, function(err, user){
          if(err){
            res.send(err);
          }
          else{
            var opts = {
              path: 'bookings.timeSlots',
              model: 'TimeSlot'
            };
            User.populate(user, opts, function(err, user){
              if(err){
                res.send(err);
              }
              else{
                var opts = {
                  path: 'bookings.bookable.bookableType',
                  model: 'BookableType'
                };
                User.populate(user, opts, function(err, user){
                  if(err){
                    res.send(err);
                  }
                  else{
                    res.json({user: user});
                  }
                });
              }
            });
          }
        });
      }
    });
  }
  else{
    res.status(401).send();
  }
});

// create new user and authenticate with passport
router.post('/', function(req, res, next){
  if(req.body.password != req.body.password2){
    res.status(403).send(err);
  }
  else{
    var hash = crypto.randomBytes(20).toString('hex');
    User.register(new User({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      key: hash,
      confirmed: "false",
      permissions: "user"}), req.body.password, function(err, user){
        if(err){
          if(err.code == 11000){
            res.status(403).json({message: "That email is already in use."});
          }
          else{
            res.status(403).send(err);
          }
        }
        else{
          passport.authenticate('local')(req, res, function(){
            res.status(200).json({success: true, key: hash})
          });
        }
      });
  }
});
// send confirmation email to user with key
router.post('/email/:email', function(req, res){
  var email = req.body.email;
  var key = req.body.key;
  host=req.get('host');
  link="http://"+req.get('host')+"/api/verify/"+key;
  var mailOptions = {
    to : email,
    subject : "Please confirm your Email account",
    html : "Hello "+req.body.firstname+",<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
  }
  transporter.sendMail(mailOptions, function(error){
    if(error){
      console.log(error);
    } else{
      res.json({success: true});
    }
  });
});

router.delete('/:username', function(req, res, next){
  var username = req.params.username;

  if( req.user && (req.user.username == username || req.user.permissions == "admin") ){
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
          if(req.user && req.user.username == user.username){
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
  }
  else{
    res.status(401).send();
  }
});

// Update the user
router.post('/:username', function(req, res, next){
  var username = req.params.username;

  // permissions checking can go here

  if( req.user && (req.user.username == username || req.user.permissions == "admin") ){
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
          if(req.body.username){
            user.username = req.body.username;
          }
          if(req.body.firstname){
            user.firstname = req.body.firstname;
          }
          if(req.body.lastname){
            user.lastname = req.body.lastname;
          }
          if(req.body.email){
            user.email = req.body.email;
          }
          if(req.body.newpass){
            if(req.body.newpass == req.body.confpass){
              user.setPassword(req.body.newpass, function(error){
                if(!error){
                  user.save(function(error){
                    if(error){
                      res.send(err)
                    }
                  });
                }
                else{
                  res.send(err)
                }
              });
            }
            else{
              res.send(err)
            }
          }
          user.save(function(err){
            if(err){
              res.send(err);
              user.save(function(err){
                if(err){
                  res.send(err);
                }
                else{
                  res.status(200).json({updatedUser: user});
                }
              });
            }
          });
        }
      }
    });
  }
  else{
    res.status(401).send();
  }
});

module.exports = router;
