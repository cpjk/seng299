var sessionControllers = angular.module('sessionControllers',[]);

sessionControllers.controller('sessionLoginController', function($http, $location, Session, CurrentUser) {
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
      $location.path("/");
    })
    .error(function(data, status, headers, config){
      if(status == 403){
        data.currentUser.errormessage = "Please validate your account. Click this link to resend the validation email.";
        vm.user = data.currentUser;
      }
      else if(status == 401){
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

sessionControllers.controller('sessionForgotController', function($http, Session, CurrentUser) {
  var vm = this;
  vm.message = "";
  vm.email = "";

  vm.forgot = function() {
    Session.forgot({email: vm.email})
    .success(function(data, status, headers, config){
      console.log("sent email");
      vm.message = "Sent password reset link";
    })
    .error(function(data, status, headers, config){
      vm.message = "Sorry, we couldn't send a reset request: " + status;
    });
  };
});

