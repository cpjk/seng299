angular.module('mainController', [])
.controller('mainController', function($scope, $http, CurrentUser){
  var vm = this;

  CurrentUser.update();
  vm.currentUser = '';

  $scope.$watch(function(){
    return CurrentUser.user;
  }, function(newCurrentUser, oldCurrentUser){
    vm.currentUser = newCurrentUser;
  });
});
