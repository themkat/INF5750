angular.module('myApp.controllers')
	.controller('QuizEditController', ['$scope', '$http', 'CourseService', 'CourseInfo',
		function($scope, $http, CourseService, CourseInfo) {

			$scope.courses = [];
			$scope.editingCourse = 0;
			$scope.motivation = '';
			$scope.stepbystep = '';
			$scope.description = '';
			$scope.questions = [];

			$scope.populateEditTable = function() {
				console.log("POPULATING EDIT TABLE!!!!!!!!!!!!");
				$scope.editingCourse = CourseInfo.getSelectedIndex();
				$scope.courses = CourseInfo.getCourses();
				console.log("Currently editing course at index " + $scope.editingCourse);
				console.log("Courses: ");
				console.log($scope.courses);
				$scope.motivation = $scope.courses[$scope.editingCourse].motivation;
				console.log("Motivation: " + $scope.motivation);
				$scope.stepbystep = $scope.courses[$scope.editingCourse].stepbystep;
				$scope.description = $scope.courses[$scope.editingCourse].description;
				$scope.questions = $scope.courses[$scope.editingCourse].questions;
			}

			$('#quiz_modal').on('shown.bs.modal', $scope.populateEditTable());
			
			$scope.buttonClick = function() {
				console.log("COURSES:");
				console.log($scope.courses);
				console.log("Selected course: " + $scope.editingCourse);
			}
	}]);
