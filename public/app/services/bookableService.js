angular.module('bookableService', [])
.factory('Bookable', function($http){
  var factory = {};

  factory.all = function(){
    return $http.get('/api/bookables');
  };

  factory.getByTypeName = function(typeName){
    return $http.get('/api/bookables/by_type/' + typeName);
  };

  return factory;
})

.factory('BookableTimeSlots', function(){
  var factory = {};

  // filter timeSlots by the given day of the week
  factory.filterByDay = function(bookables, dayOfWeek){
    var bookablesWithTimeSlots = [];

    for(k = 0; k < bookables.length; k++){
      var bookable = bookables[k];
      var timeSlots = [];

      for(i = 0; i < bookable.timeSlots.length; i++){
        var timeSlot = bookable.timeSlots[i];
        if (timeSlot.dayOfWeek == dayOfWeek){
          timeSlots.push(timeSlot);
        }
      }
      bookable.timeSlots = timeSlots;
      bookablesWithTimeSlots.push(bookable);
    }
    return bookablesWithTimeSlots;
  };

  return factory;
});
