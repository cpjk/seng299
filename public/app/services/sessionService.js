angular.module('sessionService', [])
.factory('Session', function($http){
  var factory = {};

  factory.login = function(credentials){
    return $http.post('/api/session/login', credentials);
  };

  return factory;
})

.factory('CurrentUser', function($http){
  var factory = {user: ''};

  factory.update = function(){
    $http.get('/api/session')
    .success(function(data, status, headers, config){
      console.log("session fetch success:");
      console.log(data.currentUser);
      factory.user = data.currentUser
    })
    .error(function(data, status, headers, config){
      console.log("session fetch error:");
      console.log(data);
      factory.user = '';
    });
    return factory.user;
  };

  return factory;
});
