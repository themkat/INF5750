'use strict';

/* Controllers */

/*  It has become considered better practise to separate controllers into
	different files. Not like it's done here. See angular-seed for an example
	of how it's done (this is based on angular-seed one year ago.

	Note that when you get an object from a $resource, this object
	automatically gets some $get/$save methods that can use if you want to
	update or save the object again onto the server.

See: https://docs.angularjs.org/api/ngResource/service/$resource for info
*/

angular.module('myApp.controllers', []).
controller('CoursesCtrl', ['$scope', '$http', '$sce', 'UserInformationService', 'CourseService', 'CourseInfo',
		function ($scope, $http, $sce, UserInformationService, CourseService, CourseInfo) {

		/* Array of courses */
		$scope.courses  = [];
		/* Array of modules */
		$scope.modules = [];
		/* Highest ID amongst courses */
		$scope.highestCourseId = 0;
		/* Highest ID amongst modules in the currently selected course */
		$scope.highestModuleId = 0;
		/* Number of modules in the currently selected course */
		$scope.selectedCourseId = 0;
		$scope.selectedModuleId = 0;
		$scope.modalCourse = null;
		$scope.userId = 0;

		// Array Remove - authored by John Resig (MIT Licensed)
		Array.prototype.remove = function(from, to) {
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
		}

		$scope.courseIdToIndex = function() {
			for (var i = 0; i < $scope.courses.length; i++) {
				if ($scope.courses[i].id == $scope.selectedCourseId) {
					return i;
				}
			}

			return -1;
		}

		$scope.maxCourseId = function() {
			$scope.highestCourseId = 0;
			for (var i = 0; i < $scope.courses.length; i++) {
				if ($scope.courses[i].id > $scope.highestCourseId) {
					$scope.highestCourseId = $scope.courses[i].id;
				}
			}
		}

		$scope.createCourse = function() {
			$scope.maxCourseId();

			var addedCourse = {
				'id': ++$scope.highestCourseId,
				'name': "Course " + $scope.highestCourseId,
				'description': "Description goes here.",
				'modules': []
			};

			var courses = $scope.courses;

			courses.push(addedCourse);
			$scope.courseClicked(addedCourse.id);
		}

		// Delete the currently selected course
		$scope.deleteCourse = function() {
			var index = $scope.courseIdToIndex();
			var modCourses = $scope.courses;

			if (-1 == index) {
				return;
			}

			modCourses.remove(index);
			CourseService.save(modCourses);
			$scope.courses = modCourses;

			$scope.selectedCourseId = 0;
			$scope.selectedQuestion = 0;
			$scope.modalVars = null;
		}

		$scope.courseClicked = function(id) {
			if ($scope.selectedCourseId != id) {
				$scope.selectedModuleId = 0;
			}

			$scope.selectedCourseId = id;
			var index = $scope.courseIdToIndex();
			if (-1 == index) {
				return;
			}
			$scope.modalCourse = $scope.courses[index];
			$scope.modules = $scope.courses[index].modules;
		}

		$scope.coursePassed = function(course) {
			for (var i = 0; i < course.modules.length; i++) {
				if ($scope.modulePassed(course.modules[i]) == 0) {
					return 0;
				}
			}

			return 1;
		}

		// Determine where in the list a given module is and return the index
		$scope.moduleIdToIndex = function() {
			for (var i = 0; i < $scope.modules.length; i++) {
				if ($scope.modules[i].id == $scope.selectedModuleId) {
					return i;
				}
			}

			return -1;
		}

		$scope.getModuleName = function() {
			if ($scope.selectedModuleId == 0) {
				return "";
			}
			return $scope.modules[$scope.moduleIdToIndex()].name;
		}

		$scope.getModuleMotivation = function() {
			if ($scope.selectedModuleId == 0) {
				return "";
			}

			var module = $scope.modules[$scope.moduleIdToIndex()];

			if (module.motivation == "") {
				return "No motivation written.";
			} else {
				return $sce.trustAsHtml(module.motivation);
			}
		}

		// getting the module description and stepbystep
		$scope.getModuleDescription = function() {
			if($scope.selectedModuleId === 0) {
				return "";
			}
			var module = $scope.modules[$scope.moduleIdToIndex()];
			if(module.description === "") {
				return "No description written.";
			} else {
				return module.description;
			}
		}

		$scope.getModuleStepbystep = function() {	
			if($scope.selectedModuleId === 0) {
				return "";
			}
			var module = $scope.modules[$scope.moduleIdToIndex()];
			if(module.stepbystep === "") {
				return "No step by step-guide written.";
			} else {
				return $sce.trustAsHtml(module.stepbystep);
			}
		}

		// variable  og funksjoner knyttet til å ta en quiz
		// for å starte en modal og cleare tidligere data.
		// (sorry om det er litt rotete)
		$scope.modalFinished = false;
		$scope.currentQuestionId = 0;
		$scope.numQuestions = 0;
		$scope.numCorrect = 0;
		$scope.selectedAnswer = -1;

		$scope.startModal = function() {
			$scope.populateEditTable();

			$scope.modalFinished = false;
			$scope.currentQuestionId = 0;
			$scope.numQuestions = $scope.modalVars.questions.length;
			$scope.selectedAnswer = -1;
			$scope.numCorrect = 0;
		}

		// fjerner vi prievous blir det lettere å sjekke om et spørsmål er riktig.
		$scope.prevQuestion = function() {
			if($scope.currentQuestionId > 0) {
				$scope.currentQuestionId--;
			}
		}

		$scope.nextQuestion = function() {	
			//check if the current question is correct before moving on
			// very hit and miss :(
			var curQuestion = $scope.modalVars.questions[$scope.currentQuestionId];
			if($scope.selectedAnswer == curQuestion.correct) {
				$scope.numCorrect++; 
			}	


			if($scope.currentQuestionId+1 < $scope.modalVars.questions.length) {
				$scope.currentQuestionId++;
				$scope.selectedAnswer = -1; // don't autoselect a radio-btn
			}
			else {
				$scope.modalFinished = true;
			}
		}

		// få akkurat det spørsmålet vi er på nå
		$scope.getCurrentQuestion = function() {
			//var module = $scope.modules[$scope.moduleIdToIndex()];
			if ($scope.modalVars == null) {
				return { question: "Bloop?", answers: [0, 0, 0] };
			}
			return $scope.modalVars.questions[$scope.currentQuestionId];
		}

		// variabel for antall riktige spørsmål
		$scope.numCorrect = 0;

		// sjekker om vi har nok riktige svar til å bestå quizen
		// (er midlertidig bare satt til alt riktig. 3/4 riktig er 
		//  også en mulighet)
		$scope.passedQuiz = function() {
			if ($scope.modalVars == null) {
				return;
			}
			
			var passed = $scope.numCorrect >= $scope.modalVars.requiredAnswers;

			if (passed && -1 == $scope.modalVars.passed.indexOf($scope.userId)) {
				$scope.modalVars.passed.push($scope.userId);
			}
			return $scope.numCorrect >= $scope.modalVars.requiredAnswers;
		}
		// hvordan skal vi lagre en id i passed? er det mulig med den næværende
		// strukturen å bare lagre en slik verdi? eller må vi sende hele quizen?

		// Add a new module to the list with a default name and id
		$scope.createModule = function() {

			if ($scope.selectedCourseId == 0) {
				return;
			}
			$scope.maxModuleId();

			var addedModule = {
				'id': ++$scope.highestModuleId,
				'name': "Module " + $scope.highestModuleId,
				'description': "Description goes here.",
				'motivation': "",
				'stepbystep': "",
				'questions': [
					{
						'question': "Question",
						'id': 1,
						'answers': [
							"Answer 1",
							"Answer 2",
							"Answer 3",
						],
						'correct': 0
					}
				],
				'requiredAnswers': 1,
				'passed': []
			};

			var modules = $scope.modules;

			modules.push(addedModule);
			CourseService.save($scope.courses);
			$scope.moduleClicked(addedModule.id);
		}

		// Delete the currently selected module
		$scope.deleteModule = function() {
			var index = $scope.moduleIdToIndex();
			var modModules = $scope.modules;

			if (-1 == index) {
				return;
			}

			modModules.remove(index);
			CourseService.save($scope.courses);
			$scope.modules = modModules;

			$scope.selectedModuleId = 0;
			$scope.selectedQuestion = 0;
			$scope.modalVars = null;
			$scope.maxModuleId();
		}

		$scope.moduleClicked = function(index) {
			$scope.selectedModuleId = index;
			$scope.populateEditTable();
			$scope.numCorrect = 0;
		}

		$scope.modulePassed = function(module) {
			for (var i = 0; i < module.passed.length; i++) {
				if (module.passed[i] == $scope.userId) {
					return 1;
				}
			}

			return 0;
		}


		$scope.questionClicked = function(id) {
			$scope.selectedQuestion = id;
		}

		// Find the highest ID among modules
		$scope.maxModuleId = function() {
			$scope.highestModuleId = 0;
			for (var i = 0; i < $scope.modules.length; i++) {
				if ($scope.modules[i].id > $scope.highestModuleId) {
					$scope.highestModuleId = $scope.modules[i].id;
				}
			}
		}

		/* VARIABLES USED IN THE QUIZ EDITOR TO EDIT A SINGLE MODULE */

		/* The module being edited */
		$scope.modalVars = null;
		/* Index of question currently being edited */
		$scope.selectedQuestion = 0;

		// Send the list of courses, modules and questions to the server
		$scope.saveChanges = function() {
			CourseService.save($scope.courses);
		}

		// Discard the changes made in the quiz or course editor
		$scope.discardChanges = function() {
			CourseService.query(function(data) {
				$scope.courses = data;
				$scope.maxCourseId();
				if ($scope.selectedCourseId != 0) {
					$scope.modules = $scope.courses[$scope.courseIdToIndex($scope.selectedCourseId)].modules;
				}
			});
		}

		$scope.questionRange = [];

		// Prepare the quiz editor
		$scope.populateEditTable = function() {
			var index = $scope.moduleIdToIndex();
			$scope.modalVars = $scope.modules[index];
			$scope.selectedQuestion = 0;
			$scope.numQuestions = $scope.modalVars.questions.length;
			$scope.questionRange = [];

			for (var i = 1; i <= $scope.modalVars.questions.length; i++) {
				$scope.questionRange.push(i);
			}
			console.log("NumQuestions: " + $scope.modalVars.questions.length);
			console.log("questionRange: " + JSON.stringify($scope.questionRange));
		}

		// Add a question to a module. Called when clicking the + button
		// in the editor.
		$scope.addQuestion = function() {
			var highestId = 0;

			for (var i = 0; i < $scope.modalVars.questions.length; i++) {
				if ($scope.modalVars.questions[i].id > highestId) {
					highestId = $scope.modalVars.questions[i].id;
				}
			}

			var question = {
				'question': "Question",
				'id': ++highestId,
				'answers': [
					"Answer 1",
				"Answer 2",
				"Answer 3",
				],
				'correct': 0
			}

			$scope.modalVars.questions.push(question);
			$scope.numQuestions++;

			$scope.questionRange = [];

			for (var i = 1; i <= $scope.modalVars.questions.length; i++) {
				$scope.questionRange.push(i);
			}
		}

		// Delete a question from a module. Called when clicking the - button
		// in the editor.
		$scope.deleteQuestion = function() {
			if ($scope.modalVars.questions.length <= 1) {
				return;
			}
			$scope.modalVars.questions.remove($scope.selectedQuestion);

			for (var i = 0; i < $scope.modalVars.questions.length; i++) {
				$scope.modalVars.questions[i].id = i + 1;
			}

			$scope.selectedQuestion = 0;
			$scope.numQuestions--;

			$scope.questionRange = [];

			for (var i = 1; i <= $scope.modalVars.questions.length; i++) {
				$scope.questionRange.push(i);
			}
		}

		$scope.answerNumberClicked = function(index) {
			$scope.modalVars.requiredAnswers = index;	
		}

		$scope.printProgress = function() {
			if ($scope.modalVars == null) {
				return "Oh my god what is going on you should never be able to see this";
			}
			return ($scope.currentQuestionId+1) + "/" + $scope.modalVars.questions.length + " - " + $scope.getCurrentQuestion().question; 
		}

		// Populate list of modules with data from the server
		CourseService.query(function(data) {
				$scope.courses = data;
				$scope.maxCourseId();
				});

		UserInformationService.query(function(data) {
				$scope.userId = data.id;
				});
		}]);
