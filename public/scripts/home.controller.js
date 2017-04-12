angular.module('aai').controller('HomeController', function($http, $location) {
  var showLogs = true; // set to true to show console logs, false to hide.

  var ctrl = this;
  ctrl.allVideos;
  ctrl.topTenViewed;
  ctrl.topTenVotes;

  ctrl.showAllVideos = function() {
    ctrl.allVideos = true;
    ctrl.topTenViewed = false;
    ctrl.topTenVotes = false;
  }

  ctrl.showTopTenViewed = function() {
    ctrl.allVideos = false;
    ctrl.topTenViewed = true;
    ctrl.topTenVotes = false;
  }

  ctrl.showTopTenVotes = function() {
    ctrl.allVideos = false;
    ctrl.topTenViewed = false;
    ctrl.topTenVotes = true;
  }


  ctrl.working = function() {
    if (showLogs) console.log('HomeController loaded');
  }; // end ctrl.working
  ctrl.working();

  ctrl.videos = [];

  ctrl.getAllVideos = function() {
    $http.get('https://proofapi.herokuapp.com/videos?1&10').then(function(res){
      ctrl.videos = res.data.data.sort(function(a, b){
        a = new Date(a.attributes.created_at);
        b = new Date(b.attributes.created_at);
        return a > b ? -1 : a < b ? 1 : 0;
      });
      if (showLogs) console.log(res);
      ctrl.showAllVideos();
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
      ctrl.getAllVideos();
    })
    ctrl.video = {};
  }; // end ctrl.showVideo


  ctrl.watchVideo = function(videoId) {
    var video = {'video_id' : videoId};
    if (showLogs) console.log('This is the video object:', video);
    $http.post('https://proofapi.herokuapp.com/views', video).then(function(res){
      if (showLogs) console.log('This is the response:', res);
    })

  }; // end ctrl.watchVideo

  ctrl.getTopTenViewed = function() {
    $http.get('https://proofapi.herokuapp.com/videos?1&10').then(function(res){
      ctrl.videos = res.data.data.sort(function(a, b){
        a = a.attributes.view_tally;
        b = b.attributes.view_tally;
        return a > b ? -1 : a < b ? 1 : 0;
      });
      if (showLogs) console.log('This is the top ten viewed:', ctrl.videos);
      ctrl.showTopTenViewed();
    })
  }; // end ctrl.getTopTenViewed

  ctrl.getTopTenVotes = function() {
    $http.get('https://proofapi.herokuapp.com/videos?1&10').then(function(res){
      ctrl.videos = res.data.data.sort(function(a, b){
        a = a.attributes.vote_tally;
        b = b.attributes.vote_tally;
        return a > b ? -1 : a < b ? 1 : 0;
      });
      if (showLogs) console.log('This is the top ten votes:', ctrl.videos);
      ctrl.showTopTenVotes();
    })
  }; // end ctrl.getTopTenViewed

  // var c = new Date(date).toDateString();

  ctrl.voteUp = function(video) {
    var vote = {'video_id' : video.id, 'opinion' : 1};
    if (showLogs) console.log('Voted up!', vote);
  }; // end ctrl.voteUp

  ctrl.voteDown = function(video) {
    var vote = {'video_id' : video.id, 'opinion' : -1};
    if (showLogs) console.log('Voted down...', vote);
  }; // end ctrl.voteDown

}); // end angular.module
