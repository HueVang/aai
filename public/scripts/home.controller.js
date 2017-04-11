angular.module('aai').controller('HomeController', function($http, $location) {
  var showLogs = true; 

  var ctrl = this;
  ctrl.videos = ['test', 'test2', 'test3'];

  ctrl.working = function() {
    console.log('HomeController loaded');
  }; // end ctrl.working

  ctrl.working();

  ctrl.setAuthToken = function() {
    $http.get('/home/authToken').then(function(res){
      $http.defaults.headers.common = {'X-Auth-Token' : res.data};
    });
  }; // end ctrl.setAuthToken

  ctrl.setAuthToken();

  ctrl.getAllVideos = function() {
    $http.get('https://proofapi.herokuapp.com/videos?1&10').then(function(res){
      ctrl.videos = res.data;
      if (showLogs) console.log(res);
    });
  }; // end ctrl.getAllVideos


}); // end angular.module
