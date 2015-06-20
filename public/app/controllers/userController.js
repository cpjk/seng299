var userControllers = angular.module('userControllers',[]);

userControllers.controller('userIndexController', function($http) {
    var vm = this;

    $http.get('/api/users')
    .then(function(data){
      vm.users = data.data.users;
    });
});
userControllers.controller('userShowController', function($http, $routeParams) {
    var vm = this;

    $http.get('/api/users/' + $routeParams.username)
    .success(function(data, status, headers, config){
      vm.user = data.user;
    })
});
