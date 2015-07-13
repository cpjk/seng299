var bookingControllers = angular.module('bookingControllers',[]);

bookingControllers.controller('bookingNewController', function($http, Booking, Bookable, BookableTimeSlots, $routeParams) {
  var vm = this;

  vm.facilityName = $routeParams.facilityName;
  vm.notice = "";
  if($routeParams.date){
    // ensure that date format is consistent
    vm.date = moment($routeParams.date, "YYYY-M-D").startOf("day");
  }
  else{
    vm.date = moment().startOf("day");
  }

  vm.booking = {
    date: vm.date.format("YYYY-M-D"),
    timeSlots: []
  };

  Bookable.getByTypeName($routeParams.facilityName)
  .success(function(data, status, headers, config){
    vm.bookables = data.bookables;

    BookableTimeSlots.filterByDay(vm.bookables, vm.date.day());
  })
  .error(function(data, status, headers, config){
    vm.notice += "Bookings could not be fetched."
  });

  vm.submit = function(){
    Booking.create(vm.booking)
    .success(function(data, status, headers, config){
      vm.notice = "Booking successful";
    })
    .error(function(data, status, headers, config){
      vm.notice = "Booking failed: " + data.error;
    });
  };

  // Add or remove timeSlot from booking.timeSlots
  vm.toggleSelected = function(timeSlot) {
    var index = vm.booking.timeSlots.indexOf(timeSlot);
    if(index >= 0){
      vm.booking.timeSlots.splice(index, 1);
    }
    else{
      vm.booking.timeSlots.push(timeSlot);
    }
  };
})
