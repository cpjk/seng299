angular.module('app.routes', ['ngRoute'])
.config(function($routeProvider, $locationProvider){

  $locationProvider.html5Mode(true);

  $routeProvider

  .when('/', {
    templateUrl: 'partials/home/home.jade',
    controller: 'homeController',
    controllerAs: 'homeCtrl'
  })

  .when('/facilities/:facilityName/:date', {
    templateUrl: 'partials/facilities/book.jade',
    controller: 'bookingNewController',
    controllerAs: 'bookingCtrl'
  })

  .when('/facilities/:facilityName', {
    templateUrl: 'partials/facilities/book.jade',
    controller: 'bookingNewController',
    controllerAs: 'bookingCtrl'
  })

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

  .when('/users/:username/edit', {
    templateUrl: 'partials/users/edit.jade',
    controller: 'userEditController',
    controllerAs: 'userCtrl'
  })

  .when('/new_user', {
    templateUrl: 'partials/users/new.jade',
    controller: 'userNewController',
    controllerAs: 'userCtrl'
  })

  .when('/confirm', {
    templateUrl: 'partials/users/confirm.jade',
    controller: 'userNewController',
    controllerAs: 'userCtrl'
  })

  .when('/verify', {
    templateUrl: 'partials/users/verify.jade',
    controller: 'userNewController',
    controllerAs: 'userCtrl'
  })

  .when('/sorry', {
    templateUrl: 'partials/users/sorry.jade',
    controller: 'userNewController',
    controllerAs: 'userCtrl'
  })

  .when('/login', {
    templateUrl: 'partials/session/login.jade',
    controller: 'sessionLoginController',
    controllerAs: 'sessionCtrl'
  })

  .when('/forgot', {
    templateUrl: 'partials/session/forgot.jade',
    controller: 'sessionForgotController',
    controllerAs: 'sessionCtrl'
  })

  .when('/reset', {
    templateUrl: 'partials/session/reset.jade',
    controller: 'sessionResetController',
    controllerAs: 'sessionCtrl'
  })

  .otherwise({
    redirectTo: '/'
  });
});
