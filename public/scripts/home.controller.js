angular.module('aai').controller('HomeController', function($http, $location) {
  var showLogs = true; // set to true to show console logs, false to hide.
  var ctrl = this;

  // Variables that change what content shows on the page.
  // They are linked with the ng-if's on the home.html file.
  // Whichever one that's set to "true" will display their list on the page.
  ctrl.allVideos;
  ctrl.topTenViewed;
  ctrl.topTenVotes;

  ctrl.showAllVideos = function() {
    ctrl.allVideos = true;
    ctrl.topTenViewed = false;
    ctrl.topTenVotes = false;
  };

  ctrl.showTopTenViewed = function() {
    ctrl.allVideos = false;
    ctrl.topTenViewed = true;
    ctrl.topTenVotes = false;
  };

  ctrl.showTopTenVotes = function() {
    ctrl.allVideos = false;
    ctrl.topTenViewed = false;
    ctrl.topTenVotes = true;
  };

  // Function to make sure controller has successfully loaded.
  ctrl.working = function() {
    if (showLogs) console.log('HomeController loaded');
  }; // end ctrl.working
  ctrl.working();

  // Array that holds the list of videos for any GET request to the API.
  ctrl.videos = [];
  // Gets all videos from the API and sorts them by most recent.
  ctrl.getAllVideos = function() {
    $http.get('https://proofapi.herokuapp.com/videos?1&10').then(function(res) {
      // Saves the current user's ID in the ctrl.user_id variable.
      ctrl.user_id = res.data.data[0].relationships.user.data.id;
      // Sorting method that orders video by most recent creation date.
      ctrl.videos = res.data.data.sort(function(a, b) {
        a = new Date(a.attributes.created_at);
        b = new Date(b.attributes.created_at);
        return a > b ? -1 : a < b ? 1 : 0;
      });
      ctrl.showAllVideos();
    });
  }; // end ctrl.getAllVideos

  // Retrieves authentication token from server to access API.
  ctrl.setAuthToken = function() {
    $http.get('/home/authToken').then(function(res) {
      $http.defaults.headers.common = {'X-Auth-Token' : res.data};
      ctrl.getAllVideos();
    });
  }; // end ctrl.setAuthToken
  ctrl.setAuthToken();

  ctrl.slug = function(title) {
    ctrl.video.slug = title.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  }; // end ctrl.slug

  ctrl.addVideo = function() {
    var date = new Date();
    // If statement that checks whether or not today is a weekend.
    if (date.getDay() == 0 || date.getDay() == 6) {
      alert('Sorry, no posting on the weekends.');
    } else {
      $http.get('https://proofapi.herokuapp.com/videos?1&10').then(function(res) {
        // List of all shared videos.
        var videoArray = res.data.data;
        // List of all the urls for shared videos.
        var videoUrlArray = videoArray.map(function(video) {
          return video.attributes.url;
        });
        // Checks to see if the video thats about to be shared is already in the list.
        if (videoUrlArray.includes(ctrl.video.url)) {
          alert('Duplicate video! We have this already.');
          ctrl.video = {};
        } else {
          ctrl.slug(ctrl.video.title);
          var video = ctrl.video;
          $http.post('https://proofapi.herokuapp.com/videos', video).then(function(res) {
            alert('Video added!');
            ctrl.getAllVideos();
            // Clears input field by setting the ng-model on home.html to empty.
            ctrl.video = {};
          });
        };
      });
    };
  }; // end ctrl.addVideo

  // Linked to ng-ifs on home.html.
  // True shows the edit buttons, false hides them.
  ctrl.showEdit = false;
  ctrl.showEditButtons = function() {
    if (ctrl.showEdit) {
      ctrl.showEdit = false;
    } else {
      ctrl.showEdit = true;
    };
  }; // end ctrl.showEditButtons

  // ctrl.editVideo will be the object that will contain the video to edit's information.
  // ctrl.editingVideo links to ng-ifs on the home.html page.
  // Setting it to "true" hides the add & delete buttons and brings up the edit input field.
  ctrl.editVideo = {}
  ctrl.editingVideo = false;
  // Running this function takes the video's information as an argument and sets ctrl.editVideo.
  ctrl.selectVideoToEdit = function(video) {
    if (ctrl.editingVideo) {
      ctrl.editVideo = {};
      ctrl.editingVideo = false;
    } else {
      console.log('This is the video:', video);
      ctrl.editVideo.title = video.attributes.title;
      ctrl.editVideo.id = video.id;
      ctrl.slugEdit(ctrl.editVideo.title);
      ctrl.editingVideo = true;
    };
  }; // end ctrl.selectVideoToEdit

  // Makes the video title a slug.
  ctrl.slugEdit = function(title) {
    ctrl.editVideo.slug = title.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }; // end ctrl.slugEdit

  ctrl.saveChanges = function() {
    var editedVideo = {'title' : ctrl.editVideo.title, 'slug' : ctrl.editVideo.slug};
    $http.patch('https://proofapi.herokuapp.com/videos/' + ctrl.editVideo.id, editedVideo).then(function(res) {
      if (showLogs) console.log('Video has been updated:', res);
      ctrl.editVideo= {};
      ctrl.getAllVideos();
      alert('Video updated!');
    });
  }; // end ctrl.saveChanges

  // Linked to ng-ifs on home.html.
  // True shows the delete buttons, false hides them.
  ctrl.showDelete = false;
  ctrl.showDeleteButtons = function() {
    if (ctrl.showDelete) {
      ctrl.showDelete = false;
    } else {
      ctrl.showDelete = true;
    };
  };

  ctrl.deleteVideo = function(videoId) {
    var result = confirm("Delete this video?");
      if (result) {
        $http.delete('https://proofapi.herokuapp.com/videos/' + videoId).then(function(res) {
          if (showLogs) console.log('This is the response', res);
          alert('Video deleted');
        });
      } else {
        alert('Video not deleted');
      };
  }; // end ctrl.deleteVideo

  ctrl.watchVideo = function(videoId) {
    var video = {'video_id' : videoId};
    $http.post('https://proofapi.herokuapp.com/views', video).then(function(res) {
      if (showLogs) console.log('This is the response:', res);
    });
  }; // end ctrl.watchVideo

  ctrl.getTopTenViewed = function() {
    $http.get('https://proofapi.herokuapp.com/videos?1&10').then(function(res) {
      // Sorts the videos by most views.
      ctrl.videos = res.data.data.sort(function(a, b){
        a = a.attributes.view_tally;
        b = b.attributes.view_tally;
        return a > b ? -1 : a < b ? 1 : 0;
      });
      // Changes the ng-ifs on the html page to show the top 10 most viewed videos.
      ctrl.showTopTenViewed();
    });
  }; // end ctrl.getTopTenViewed

  ctrl.getTopTenVotes = function() {
    $http.get('https://proofapi.herokuapp.com/videos?1&10').then(function(res) {
      // Sorts the videos by most votes.
      ctrl.videos = res.data.data.sort(function(a, b){
        a = a.attributes.vote_tally;
        b = b.attributes.vote_tally;
        return a > b ? -1 : a < b ? 1 : 0;
      });
      // Changes the ng-ifs on the html page to show the top 10 most voted videos.
      ctrl.showTopTenVotes();
    });
  }; // end ctrl.getTopTenViewed

  ctrl.voteUp = function(video) {
    var date = new Date();
    // Checks to see if its the weekend or weekday.
    if (date.getDay() == 0 || date.getDay() == 6) {
      alert('Sorry, no voting on the weekends.')
    } else {
      var vote = {'video_id' : video.id, 'opinion' : 1};
      ctrl.checkDate(video, vote);
    };
  }; // end ctrl.voteUp

  ctrl.voteDown = function(video) {
    var date = new Date();
    // Checks to see if its the weekend or weekday.
    if (date.getDay() == 0 || date.getDay() == 6) {
      alert('Sorry, no voting on the weekends.')
    } else {
      var vote = {'video_id' : video.id, 'opinion' : -1};
      ctrl.checkDate(video, vote);
    };
  }; // end ctrl.voteDown

  // Variable that holds the date of the most recent vote.
  var dateOfLastVote;
  ctrl.checkDate = function(video, vote) {
    var user_id = ctrl.user_id;
    var video_id = video.id;
    var currentDate = new Date().toDateString();
    // Retrieves the date of the most recent vote for the specific user.
    $http.get('/home/dates/' + user_id).then(function(res) {
      if (showLogs) console.log('This is the date from the GET database:', res.data);
      // Condition if the database does not have any results for the user.
      if (res.data.length == 0) {
        dateOfLastVote = currentDate;
        // Posts the current date linked to the user into the database.
        $http.post('/home/dates/', {'user_id' : user_id, 'date' : currentDate}).then(function(res) {
          if (showLogs) console.log('Posted into dates table:', res.data);
        });
      } else {
        // Sets the dateOfLastVote to the most recent date that the user voted.
        dateOfLastVote = res.data[0].date;
      }
      // If statement to check if the user is voting on a new day.
      if (currentDate == dateOfLastVote) {
        // Gets all the videos the user has voted for today.
        $http.get('/home/votes/' + user_id).then(function(res) {
          var alreadyVotedToday = false;
          if (showLogs) console.log('This is the votes for the user:', res.data);
          var voteList = res.data;
          // Iterates through the list of videos that already have been voted on today.
          voteList.forEach(function(vote) {
            // If the video already has a vote today, changed alreadyVotedToday to true.
            if (video_id == vote.video_id && currentDate == vote.date) {
              alreadyVotedToday = true;
            };
          });
          if (alreadyVotedToday) {
            alert('You voted for this already');
          } else {
            alert('New vote for today!');
            var voteInfo = {'user_id' : user_id, 'video_id' : video_id, 'date' : currentDate};
            // Posts vote information into database to keep for reference.
            $http.post('/home/votes', voteInfo).then(function(res) {
              if (showLogs) console.log('Posted info into votes:', res.data);
              // Posts vote into the API's database.
              $http.post('https://proofapi.herokuapp.com/votes', vote).then(function(res) {
                if (showLogs) console.log('This is the response:', res);
              });
            });
          };
        });
      } else {
        // Makes the most recent vote into today's date.
        dateOfLastVote = currentDate;
        // Deletes the previous date reference to the user.
        $http.delete('/home/dates/' + user_id).then(function(res) {
          // Deletes all vote references on the previous day for the user.
          $http.delete('/home/votes/' + user_id).then(function(res) {
            // Posts new(current) date reference for the user.
            $http.post('/home/dates/', {'user_id' : user_id, 'date' : currentDate}).then(function(res) {
              alert('First vote of the day!');
              var voteInfo = {'user_id' : user_id, 'video_id' : video_id, 'date' : currentDate};
              // Posts vote information into database to keep for reference.
              $http.post('/home/votes', voteInfo).then(function(res) {
                // Posts vote into the API's database.
                $http.post('https://proofapi.herokuapp.com/votes', vote).then(function(res) {
                  if (showLogs) console.log('This is the response:', res);
                });
              });
            });
          });
        });
      };
    });
  }; // end ctrl.checkDate


}); // end angular.module
