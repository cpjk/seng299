angular.module('app.routes', ['ngRoute'])
.config(function($routeProvider, $locationProvider){

  $locationProvider.html5Mode(true);

  $routeProvider

    .when('/users', {
      templateUrl: 'partials/users/index.jade',
      controller: 'userIndexController',
      controllerAs: 'userCtrl'
    })
    .when('/users/:username', {
      templateUrl: 'partials/users/show.jade',
      controller: 'userShowController',
      controllerAs: 'userCtrl'
    })
    .otherwise({
      redirectTo: "/"
    });
});
