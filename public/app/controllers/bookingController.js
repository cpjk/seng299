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
  vm.nextDate = vm.date.clone();
  vm.nextDate.add(1, 'days');
  vm.nextDateUrl = "/facilities/" + vm.facilityName + "/" + vm.nextDate.format('YYYY-M-D');

  vm.prevDate = vm.date.clone();
  vm.prevDate.subtract(1, 'days');
  vm.prevDateUrl = "/facilities/" + vm.facilityName + "/" + vm.prevDate.format('YYYY-M-D');

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
  })
  .finally(function(){
    Booking.bookedTimeSlots(vm.bookables)
    .success(function(data, status, headers, config){
      vm.bookables = data.bookables;
    })
    .error(function(data, status, headers, config){
    });
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
  vm.toggleSelected = function(timeSlotWithBooked) {
    if(!timeSlotWithBooked.booked){
      var timeSlot = timeSlotWithBooked.timeSlot;
      var index = vm.booking.timeSlots.indexOf(timeSlot);
      if(index >= 0){
        vm.booking.timeSlots.splice(index, 1);
      }
      else{
        vm.booking.timeSlots.push(timeSlot);
      }
    }
  };
})
