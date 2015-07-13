var express = require('express');
var router = express.Router();
var Booking = require('../../../app/models/booking')
var User = require('../../../app/models/user')
var TimeSlot = require('../../../app/models/timeSlot')
var moment = require("moment");

var MAX_BOOKING_HOURS = 2;

var timeLimitExceeded = function(timeSlots){
  // sort by hourOfDay, ascending
  timeSlots.sort(function(a,b){
    return a.hourOfDay - b.hourOfDay;
  });
  return timeSlots[timeSlots.length-1].hourOfDay - timeSlots[0].hourOfDay > MAX_BOOKING_HOURS - 1;
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
    else{
      var booking = new Booking({
        date: date,
        timeSlots: timeSlots
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
});

module.exports = router;
