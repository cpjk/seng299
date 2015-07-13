var express = require('express');
var router = express.Router();
var Booking = require('../../../app/models/booking')
var User = require('../../../app/models/user')
var TimeSlot = require('../../../app/models/timeSlot')
var Bookable = require('../../../app/models/bookable')
var moment = require("moment");

var MAX_BOOKING_HOURS = 2;

// sort by hourOfDay, ascending
var sorted = function(timeSlots) {
  timeSlots.sort(function(a,b){
    return a.hourOfDay - b.hourOfDay;
  });
  return timeSlots;
}

var timeLimitExceeded = function(timeSlots){
  return timeSlots[timeSlots.length-1].hourOfDay - timeSlots[0].hourOfDay > MAX_BOOKING_HOURS - 1;
}

var inPast = function(timeSlots, date){
  var dateWithHour = date.add(timeSlots[0].hourOfDay, 'hours');
  return dateWithHour.diff(moment()) < 0;
}

// check if multiple bookables are being booked at once
var multipleBookables = function(timeSlots){
  var currentBookableId = null;
  var multiple = false;

  for(i = 0; i < timeSlots.length; i++){
    var bookableId = timeSlots[i].bookable;
    if(currentBookableId && currentBookableId.id != bookableId.id){
      return true;
    }
    else{
      currentBookableId = bookableId;
    }
  }

  return false;
}

var userHasCurrentBookingsForFacility = function(user, date, bookable){
  var bookings =  user.bookings;

  for(i = 0; i < bookings.length; i++){
    var booking = bookings[i];

    if(moment(booking.date).isSame(date) && bookable.bookableType.equals(booking.bookable.bookableType)){
      return true;
    }
  }
  return false;
}

var alreadyBooked = function(bookings, date, timeSlots){
  for(i = 0; i < timeSlots.length; i++){
    var timeSlot = timeSlots[i];

    for(k = 0; k < bookings.length; k++){
      var booking = bookings[k];
      var bookingDate = moment(bookings[k].date);

      if(bookingDate.isSame(date)){
        for(j = 0; j < booking.timeSlots.length; j++){
          var bookingTimeSlot = booking.timeSlots[j];

          if(bookingTimeSlot.equals(timeSlot)){
            return true;
          }
        }
      }
    }
  }
  return false;
}

router.get('/', function(req, res, next){
  Booking.find({})
  .populate("timeSlots")
  .exec(function(err, bookings){
    if(err){
      res.send(err);
    }
    else{
      res.json({
        bookings: bookings
      });
    }
  });
});

router.post('/', function(req, res, next){
  var timeSlots = req.body.timeSlots;
  var date = moment(req.body.date, "YYYY-M-D");
  var currentUser = req.user;

  TimeSlot.find({
    '_id': {
      $in: timeSlots
    }
  }, function(err, timeSlots){
    timeSlots = sorted(timeSlots);

    if(err){
      res.send(err);
    }
    else if(timeSlots.length == 0){
      res.status(403).json({error: "No timeslots selected."});
    }
    else if (timeLimitExceeded(timeSlots)){
      res.status(403).json({error: "Time limit exceeded."});
    }
    else if (multipleBookables(timeSlots)){
      res.status(403).json({error: "Cannot book multiple bookables in a single booking."});
    }
    else if (inPast(timeSlots, date)){
      res.status(403).json({error: "Cannot create bookings in the past."});
    }
    else if(!currentUser){
      res.status(403).json({error: "You must be logged in to create a booking."});
    }
    else{
      Booking.find({})
      .populate('timeSlots')
      .exec(function(err, bookings){
        if(err){
          res.send(err);
        }
        else if(alreadyBooked(bookings, date, timeSlots)) {
          res.status(403).json({error: "One or more of the timeSlots has already been booked."});
        }
        else{
          Bookable.findOne({ timeSlots: timeSlots[0] })
          .populate('bookableType')
          .exec(function(err, bookable){
            if(err){
              res.send(err);
            }
            else{
              User.findOne({username: currentUser.username})
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
                        path: 'bookings.bookable.bookableType',
                        model: 'BookableType'
                      };
                      User.populate(user, opts, function(err, user){
                        if(userHasCurrentBookingsForFacility(user, date, bookable)){
                          res.status(403).json({error: "You can only make one booking per facility per day."});
                        }
                        else{
                          var booking = new Booking({
                            date: date,
                            timeSlots: timeSlots,
                            bookable: bookable
                          });

                          booking.save(function(err){
                            if(err) {
                              res.send(err);
                            }
                            else{
                              user.bookings.push(booking);
                              user.save(function(err){
                                if(err){
                                  res.send(err);
                                }
                                else{
                                  res.status(200).json({success: "Success"});
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
