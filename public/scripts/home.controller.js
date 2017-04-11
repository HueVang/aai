angular.module('aai').controller('HomeController', function($http, $location) {
  var showLogs = true;

  var ctrl = this;
  ctrl.videos = ['test', 'test2', 'test3'];

  ctrl.working = function() {
    if (showLogs) console.log('HomeController loaded');
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
      ctrl.videos = res.data.data;
      if (showLogs) console.log(res);
    });
  }; // end ctrl.getAllVideos

  ctrl.slug = function(title) {
    ctrl.video.slug = title.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }; // end ctrl.slug

  ctrl.showVideo = function() {
    ctrl.slug(ctrl.video.title)
    var video = ctrl.video
    $http.post('https://proofapi.herokuapp.com/videos', video).then(function(res){
      if (showLogs) console.log('The response:', res);
    })
  }; // end ctrl.showVideo


}); // end angular.module
