angular.module('bookingService', [])
.factory('Booking', function($http){
  var factory = {};

  factory.all = function(){
    return $http.get('/api/bookings');
  };

  factory.create = function(booking){
    return $http.post('/api/bookings', booking);
  };

  return factory;
});
