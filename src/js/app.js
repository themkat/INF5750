'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ngResource',
  'leaflet-directive'
]).
config(['$routeProvider', function($routeProvider , RestangularProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
    $routeProvider.when('/view3', {templateUrl: 'partials/partial3.html', controller: 'MyCtrl3'});
    $routeProvider.when('/qm', {templateUrl: 'partials/quizmaker.html', controller: 'MyCtrl1'});
     $routeProvider.when('/courses', {templateUrl: 'partials/courses.html', controller: 'MyCtrl1'});
    $routeProvider.otherwise({redirectTo: '/view1'});
}]);
