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
controller('CoursesCtrl', ['$scope', '$http', 'UserInformationService', 'CourseService', 'CourseInfo',
		function ($scope, $http, UserInformationService, CourseService, CourseInfo) {

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
			$scope.answers = [];
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
				return module.motivation;
			}
		}

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
					'passed': ["xE7jOejl9FI"]
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
			$scope.answers = [];
			$scope.modalVars = null;
			$scope.maxModuleId();
		}

		$scope.moduleClicked = function(index) {
			$scope.selectedModuleId = index;
			$scope.populateEditTable();
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
			$scope.answers = $scope.modalVars.questions[$scope.selectedQuestion].answers;
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
		/* Array of answers to the current question */
		$scope.answers = [];

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

		// Prepare the quiz editor
		$scope.populateEditTable = function() {
			var index = $scope.moduleIdToIndex();
			$scope.modalVars = $scope.modules[index];
			$scope.selectedQuestion = 0;
			$scope.answers = $scope.modalVars.questions[$scope.selectedQuestion].answers;
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
			$scope.answers = $scope.modalVars.questions[$scope.selectedQuestion].answers;

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
/*
   .controller('MyCtrl1', ['$scope', 'MeService', 'ProfileService',
   function ($scope, MeService, ProfileService) {

   $scope.dhisAPI = dhisAPI;

   $scope.me = MeService.get(function () {
   console.log('$scope.me='+JSON.stringify($scope.me));
   });

   $scope.refreshMe = function() {
   $scope.me.$get();
   };

   $scope.profile = ProfileService.get(function () {
   console.log('$scope.profie='+JSON.stringify($scope.profile));
   });

   $scope.saveProfile = function() {
   $scope.profile.$save({}, function() {
   alert("Profile saved successfully.");
   },
   function() {
   alert("Profile save failed.");
   }
   );
   console.log('$scope.profie='+JSON.stringify($scope.profile));
   };
   }])
   .controller('MyCtrl2', ['$scope', 'UserSettingService', function ($scope, UserSettingService) {

   $scope.userSetting = UserSettingService.get(function () {
   console.log("$scope.userSetting="+JSON.stringify($scope.userSetting));
   });

   $scope.saveSetting = function () {
   console.log('Saving setting:'+JSON.stringify($scope.userSetting));
   $scope.userSetting.$save({}, function() {
   alert("Data saved successfully.");
   });
   }

   $scope.refreshSetting = function () {
   $scope.userSettingFetched = UserSettingService.get(function () {
   $scope.earlierSetting = $scope.userSettingFetched.value;
   });
   }

   }])
   .controller('MyCtrl3', ['$scope', function ($scope) {
   console.log('Ctrl3');

   $scope.location = {lat: 0.602118, lng: 30.160217};

   $scope.center = {
lat: 0.577400,
lng: 30.201073,
zoom: 10
};

$scope.markers = new Array();

$scope.addMarkers = function () {
console.log('Ctrl3 Add markers');
$scope.markers.push({
lat: $scope.location.lat,
lng: $scope.location.lng,
message: "My Added Marker"
});

};

$scope.$on("leafletDirectiveMap.click", function (event, args) {
		var leafEvent = args.leafletEvent;
		console.log('Ctrl3 adding marker at lat=' + leafEvent.latlng.lat + ', lng=' + leafEvent.latlng.lng);
		$scope.location.lng = leafEvent.latlng.lng;
		$scope.location.lat = leafEvent.latlng.lat;

		$scope.markers.push({
lat: leafEvent.latlng.lat,
lng: leafEvent.latlng.lng,
message: "My Added Marker"
});
		});

$scope.removeMarkers = function () {
	console.log('Ctrl3 remove markers');
	$scope.markers = new Array();
}

$scope.markers.push({
lat: $scope.location.lat,
lng: $scope.location.lng,
focus: true,
message: "A draggable marker",
draggable: true
});

$scope.removeOsmLayer = function() {
	delete this.layers.baselayers.osm;
	delete this.layers.baselayers.googleTerrain;
	delete this.layers.baselayers.googleRoadmap;
	delete this.layers.baselayers.googleHybrid;
	this.layers.baselayers.cycle = {
name: 'OpenCycleMap',
	  type: 'xyz',
	  url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
	  layerOptions: {
subdomains: ['a', 'b', 'c'],
			attribution: '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			continuousWorld: true
	  }
	};
};

$scope.addOsmLayer = function() {
	delete this.layers.baselayers.cycle;
	delete this.layers.baselayers.googleTerrain;
	delete this.layers.baselayers.googleRoadmap;
	delete this.layers.baselayers.googleHybrid;
	this.layers.baselayers.osm = {
name: 'OpenStreetMap',
	  type: 'xyz',
	  url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	  layerOptions: {
subdomains: ['a', 'b', 'c'],
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			continuousWorld: true
	  }
	};
};

$scope.showGoogleLayers = function() {
	delete this.layers.baselayers.cycle;
	delete this.layers.baselayers.osm;
	this.layers.baselayers = {
googleTerrain: {
name: 'Google Terrain',
	  layerType: 'TERRAIN',
	  type: 'google'
			   },
googleHybrid: {
name: 'Google Hybrid',
	  layerType: 'HYBRID',
	  type: 'google'
			  },
googleRoadmap: {
name: 'Google Streets',
	  layerType: 'ROADMAP',
	  type: 'google'
			   }
	};
};

angular.extend($scope, {
layers: {
baselayers: {
osm: {
name: 'OpenStreetMap',
type: 'xyz',
url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
layerOptions: {
subdomains: ['a', 'b', 'c'],
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
continuousWorld: true
}
},
cycle: {
name: 'OpenCycleMap',
type: 'xyz',
url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
layerOptions: {
subdomains: ['a', 'b', 'c'],
attribution: '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
continuousWorld: true
}
},
googleTerrain: {
name: 'Google Terrain',
	  layerType: 'TERRAIN',
	  type: 'google'
			   },
googleHybrid: {
name: 'Google Hybrid',
	  layerType: 'HYBRID',
	  type: 'google'
			  },
googleRoadmap: {
name: 'Google Streets',
	  layerType: 'ROADMAP',
	  type: 'google'
			   },
landscape: {
name: 'Landscape',
	  type: 'xyz',
	  url: 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
	  layerOptions: {
subdomains: ['a', 'b', 'c'],
			attribution: '&copy; <a href="http://www.thunderforest.com/about/">Thunderforest</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			continuousWorld: true
	  }
		   },
cloudmade1: {
name: 'Cloudmade Night Commander',
	  type: 'xyz',
	  url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
	  layerParams: {
key: '007b9471b4c74da4a6ec7ff43552b16f',
	 styleId: 999
	  },
layerOptions: {
subdomains: ['a', 'b', 'c'],
			continuousWorld: true
			  }
			},
cloudmade2: {
name: 'Cloudmade Tourist',
	  type: 'xyz',
	  url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
	  layerParams: {
key: '007b9471b4c74da4a6ec7ff43552b16f',
	 styleId: 7
	  },
layerOptions: {
subdomains: ['a', 'b', 'c'],
			continuousWorld: true
			  }
			}
}
}
});
}]);
*/
