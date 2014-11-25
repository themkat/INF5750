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
    $routeProvider.when('/qm', {templateUrl: 'partials/quizmaker.html', controller: 'MyCtrl1'});
     $routeProvider.when('/courses', {templateUrl: 'partials/courses.html', controller: 'CoursesCtrl'});
    $routeProvider.when('/ucourses', {templateUrl: 'partials/user-courses.html', controller: 'MyCtrl1'});
    $routeProvider.when('/quiz', {templateUrl: 'partials/quiz.html', controller: 'MyCtrl1'});
    
    $routeProvider.otherwise({redirectTo: '/courses'});
}]);
