angular.module('userCtrl',[])
.controller('userController', function($http) {
    var vm = this;

    $http.get('/api/users')
    .then(function(data){
      vm.users = data.data.users;
    });
});
