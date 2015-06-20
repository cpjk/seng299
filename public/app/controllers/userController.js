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
    username: ""
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
