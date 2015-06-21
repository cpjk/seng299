var sessionControllers = angular.module('sessionControllers',[]);

sessionControllers.controller('sessionLoginController', function($http, Session, CurrentUser) {
  var vm = this;
  vm.message = "";
  vm.username = "";
  vm.password = "";

  vm.login = function() {
    Session.login({username: vm.username, password: vm.password})
    .success(function(data, status, headers, config){

      CurrentUser.user = data.currentUser;
      vm.currentUser = CurrentUser.user;
      vm.message = "Login successful!";
    })
    .error(function(data, status, headers, config){
      if(status == 401){
        vm.message = "The username and password did not match. Please try again.";
      }
      else{
        vm.message = "There was an error, with HTTP response code " + status;
      }
    });
  };
});

sessionControllers.controller('sessionLogoutController', function($http, Session, CurrentUser) {
  vm = this;

  vm.logout = function() {
    Session.logout()
    .success(function(data, status, headers, config){
      CurrentUser.update();
      vm.message = "Logged out successfully."
    })
    .error(function(data, status, headers, config){
       vm.message = "There was an error, with HTTP response code " + status;
    });
  };
});
