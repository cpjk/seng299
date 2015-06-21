angular.module('mainController', [])
.controller('mainController', function($scope, $http, CurrentUser){
  var vm = this;

  CurrentUser.update();
  vm.currentUser = '';
  vm.currentUserUrl = '';

  // watch to see if the current user changes
  // and change variables accordingly
  $scope.$watch(function(){
    return CurrentUser.user;
  }, function(newCurrentUser, oldCurrentUser){
    vm.currentUser = newCurrentUser;
    vm.currentUserUrl = CurrentUser.profileUrl();
  });
});
