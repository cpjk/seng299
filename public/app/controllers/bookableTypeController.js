var bookingControllers = angular.module('bookableTypeControllers',[]);

bookingControllers.controller('bookableTypeIndexController', function($http, BookableType) {
  var vm = this;

  BookableType.all()
  .success(function(data, status, headers, config){
    vm.bookableTypes = data.bookableTypes;
  })
  .error(function(data, status, headers, config){
    vm.notice += "Facilities could not be fetched."
  })
});
