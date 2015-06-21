angular.module('sessionService', [])
.factory('Session', function($http){
  var factory = {};

  factory.login = function(credentials){
    return $http.post('/api/session/login', credentials);
  };

  factory.logout = function(){
    return $http.post('/api/session/logout');
  };

  return factory;
})

.factory('CurrentUser', function($http){
  var factory = {user: ''};

  // updates self.user by hitting the /api/session endpoint to
  // grab the current user
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

  factory.profileUrl = function(){
    return "/users/" + factory.user.username;
  };

  return factory;
});
