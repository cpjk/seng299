angular.module('app.routes', ['ngRoute'])
.config(function($routeProvider, $locationProvider){

  $locationProvider.html5Mode(true);

  $routeProvider

    .when('/users', {
      templateUrl: 'partials/users/index.jade',
      controller: 'userController',
      controllerAs: 'userCtrl'
    })
});
