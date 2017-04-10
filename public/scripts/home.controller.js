angular.module('aai').controller('HomeController', function($http, $location) {

  var ctrl = this;

  ctrl.working = function() {
    console.log('HomeController loaded');
  }; // end ctrl.working

  ctrl.working();

}); // end angular.module
