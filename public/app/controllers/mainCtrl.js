angular.module('mainCtrl', [])
  .controller('mainController', function($http){
    var vm = this;

    $http.get('/api/users')
    .then(function(data){
      vm.users = data.data.users;
    });

    vm.meow = 'test';
  })
