angular.module('sessionService', [])
.factory('Session', function($http){
  var factory = {};

  factory.login = function(credentials){
    return $http.post('/api/session/login', credentials);
  };

  return factory;
});
