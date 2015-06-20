angular.module('userService', [])
.factory('User', function($http){
  var factory = {};

  factory.all = function(){
    return $http.get('/api/users');
  }

  factory.get = function(username){
    return $http.get('/api/users/' + username);
  };

  return factory;
});
