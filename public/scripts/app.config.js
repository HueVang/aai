// routing
angular
.module('aai')
.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider
  .when('/', {
    templateUrl: 'views/home.html',
    controller: 'HomeController as home'
  })
});
