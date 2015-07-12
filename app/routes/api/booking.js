var express = require('express');
var router = express.Router();
var Booking = require('../../../app/models/booking')
var User = require('../../../app/models/user')
var TimeSlot = require('../../../app/models/timeSlot')
var Bookable = require('../../../app/models/bookable')
var moment = require("moment");

var MAX_BOOKING_HOURS = 2;

var timeLimitExceeded = function(timeSlots){
  // sort by hourOfDay, ascending
  timeSlots.sort(function(a,b){
    return a.hourOfDay - b.hourOfDay;
  });
  return timeSlots[timeSlots.length-1].hourOfDay - timeSlots[0].hourOfDay > MAX_BOOKING_HOURS - 1;
}

var inPast = function(date){
  return date.diff(moment()) < 0;
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

  TimeSlot.find({
    '_id': {
      $in: timeSlots
    }
  }, function(err, timeSlots){

    if (timeLimitExceeded(timeSlots)){
      res.status(403).json({error: "Time limit exceeded."});
    }
    else if (multipleBookables(timeSlots)){
      res.status(403).json({error: "Cannot book multiple bookables in a single booking."});
    }
    else if (inPast(date)){
      res.status(403).json({error: "Cannot create bookings in the past."});
    }
    else{
      Bookable.findOne({ timeSlots: timeSlots[0] }, function(err, bookable){
        if(err){
          res.send(err);
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
              res.status(200).json({success: "Success"});
            }
          });
        }
      });
    }
  });
});

module.exports = router;
