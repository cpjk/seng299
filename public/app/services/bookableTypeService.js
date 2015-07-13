angular.module('bookableTypeService', [])
.factory('BookableType', function($http){
  var factory = {};

  factory.all = function(){
    return $http.get('/api/bookabletypes');
  };

  return factory;
});
