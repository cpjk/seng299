angular.module('app.routes', ['ngRoute'])
.config(function($routeProvider, $locationProvider){

  $routeProvider

    .when('/users', {
      templateUrl: 'app/views/users/index.jade',
      controller: 'userController',
      controllerAs: 'userCtrl'
    })

  $locationProvider.html5Mode(true);
});
