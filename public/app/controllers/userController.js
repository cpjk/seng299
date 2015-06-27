var userControllers = angular.module('userControllers',[]);

userControllers.controller('userIndexController', function($http, User) {
  var vm = this;

  User.all()
  .success(function(data, status, headers, config){
    vm.users = data.users;
  });
});

userControllers.controller('userShowController', function($http, $routeParams, User) {
  var vm = this;
  var username = $routeParams.username;

  User.get(username)
  .success(function(data, status, headers, config){
    vm.user = data.user;
  })
});

userControllers.controller('userNewController', function($http, User) {
  var vm = this;
  vm.success = "";

  vm.user = {
    username: "",
    password: ""
  };

  vm.submit = function(){
    User.create(vm.user)
    .then(function(data){
      if(data.data.success){
        vm.success = "success!";
      }
      else{
        vm.success = data.data.message;
      }
    });
  };
});

userControllers.controller('userDeleteController', function($http, User, CurrentUser, $location) {
  var vm = this;
  vm.success = "";

  vm.delete = function(user){
    User.delete(user.username)

    .success(function(data, status, headers, config){
      if(status == 200){
        // The user has been logged out. Update the current user
        CurrentUser.update();
      }
      vm.success = "User deleted successfully."
      $location.path("/users");
    })

    .error(function(data, status, headers, config){
      if(status == 404){
        vm.success = "User could not be found."
      }
      else{
        vm.success = "There was an error with code " + status;
      }
    });
  };
});
