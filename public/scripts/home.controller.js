angular.module('aai').controller('HomeController', function($http, $location) {

  var ctrl = this;
  ctrl.videos = ['test', 'test2', 'test3'];

  ctrl.working = function() {
    console.log('HomeController loaded');
  }; // end ctrl.working

  ctrl.working();

  ctrl.click = function() {
    console.log('Button click works');
  }; // end ctrl.click

}); // end angular.module
