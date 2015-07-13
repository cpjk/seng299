var mongoose = require('../../app/models/mongoose');

var timeSlotSchema = mongoose.Schema({
  dayOfWeek: Number,
  hourOfDay: Number,
  bookable: {type: mongoose.Schema.Types.ObjectId, ref: 'Bookable'},
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
