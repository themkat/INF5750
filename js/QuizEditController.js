angular.module('myApp.controllers')
	.controller('QuizEditController', ['$scope', '$http', 'CourseService',
		function($scope, $http, CourseService) {
			$scope.dhisAPI = dhisAPI;
	}]);
