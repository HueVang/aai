angular.module('aai').controller('HomeController', function($http, $location) {
  var showLogs = true; // set to true to show console logs, false to hide.

  var ctrl = this;
  ctrl.videos = [];

  ctrl.working = function() {
    if (showLogs) console.log('HomeController loaded');
  }; // end ctrl.working

  ctrl.working();

  ctrl.getAllVideos = function() {
    $http.get('https://proofapi.herokuapp.com/videos?1&10').then(function(res){
      ctrl.videos = res.data.data.sort(function(a, b){
        a = new Date(a.attributes.created_at);
        b = new Date(b.attributes.created_at);
        return a > b ? -1 : a < b ? 1 : 0;
      });
      if (showLogs) console.log(res);
    });
  }; // end ctrl.getAllVideos

  ctrl.setAuthToken = function() {
    $http.get('/home/authToken').then(function(res){
      $http.defaults.headers.common = {'X-Auth-Token' : res.data};
      ctrl.getAllVideos();
    });
  }; // end ctrl.setAuthToken

  ctrl.setAuthToken();

  ctrl.slug = function(title) {
    ctrl.video.slug = title.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }; // end ctrl.slug

  ctrl.addVideo = function() {
    ctrl.slug(ctrl.video.title)
    var video = ctrl.video
    $http.post('https://proofapi.herokuapp.com/videos', video).then(function(res){
      if (showLogs) console.log('The response:', res);
    })
    ctrl.video = {};
    ctrl.getAllVideos();
  }; // end ctrl.showVideo

}); // end angular.module
