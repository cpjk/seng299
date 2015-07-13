angular.module('bookingService', [])
.factory('Booking', function($http){
  var factory = {};

  factory.all = function(){
    return $http.get('/api/bookings');
  };

  factory.bookedTimeSlots = function(bookables){
    return $http.post('/api/bookings/time_slots_booked', {bookables: bookables});
  };

  factory.create = function(booking){
    return $http.post('/api/bookings', booking);
  };

  factory.delete = function(booking){
    return $http.put('/api/bookings', {booking: booking});
  };

  return factory;
});
