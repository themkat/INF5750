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
	controller('CoursesCtrl', ['$scope', '$http', '$location', 'CourseService', 'CourseInfo',
		function ($scope, $http, $location, CourseService, CourseInfo) {

		/* DUMMY COURSES */
		$scope.courses  = []

		// Determine where in the list a given course is and return the index
		$scope.courseIdToIndex = function() {
			for (var i = 0; i < $scope.numberOfCourses; i++) {
				if ($scope.courses[i].id == $scope.selectedCourseIndex) {
					return i;
				}
			}

			return -1;
		}
/*
		$scope.questionIdToIndex = function() {
			if ($scope.modalVars) {
				for(var i = 0; i < $scope.modalVars.questions.length; i++) {
					if ($scope.modalVars.questions[i].id == $scope.selectedQuestion) {
						return i;
					}
				}
			}
		}
*/
		// Array Remove - authored by John Resig (MIT Licensed)
		Array.prototype.remove = function(from, to) {
			var rest = this.slice((to || from) + 1 || this.length);
			this.length = from < 0 ? this.length + from : from;
			return this.push.apply(this, rest);
		}

		$scope.highestId = 0;

		$scope.numberOfCourses = 0;

		// Delete the currently selected course
		$scope.deleteCourse = function() {
			var index = $scope.courseIdToIndex();
			var modCourses = $scope.courses;

			if (-1 == index) {
				return;
			}

			console.log("Course to delete: " + $scope.selectedCourseIndex);
			console.log(modCourses[index]);
			modCourses.remove(index);
			CourseService.save(modCourses);
			$scope.courses = modCourses;
			$scope.numberOfCourses = $scope.courses.length;
		}

		// Add a new course to the list with a default name and id
		$scope.createCourse = function() {
			$scope.maxId();
			++$scope.numberOfCourses;

			var addedCourse = {
				'id': ++$scope.highestId,
				'name': "Course " + $scope.highestId,
				'description': "Placeholder description for course " + $scope.highestId,
				'motivation': "Placeholder motivation for course " + $scope.highestId,
				'stepbystep': "Placeholder step-by-step for course " + $scope.highestId,
				'questions': [
					{
						'question':"Placeholder question 1?",
						'id':1,
						'answers': [
							"Placeholder answer 1-1.",
							"Placeholder answer 1-2.",
							"Placeholder answer 1-3."
						]
					},
					{
						'question':"Placeholder question 2?",
						'id':2,
						'answers': [
							"Placeholder answer 2-1.",
							"Placeholder answer 2-2.",
							"Placeholder answer 2-3."
						]
					}
				]
			};

			var courses = $scope.courses;
			console.log(courses);

			courses.push(addedCourse);
			console.log(courses);
			CourseService.save(courses);
		}
		
		$scope.selectedCourseIndex = 0;
		
		$scope.itemClicked = function($index) {
		    $scope.selectedCourseIndex = $index;
			$scope.populateEditTable();
		}

		$scope.questionClicked = function(id) {
			$scope.selectedQuestion = id;
			$scope.answers = $scope.modalVars.questions[$scope.selectedQuestion].answers;
		}

		// Find the highest ID among courses
		$scope.maxId = function() {
			for (var i = 0; i < $scope.numberOfCourses; i++) {
				if ($scope.courses.id > $scope.highestId) {
					$scope.highestId = $scope.courses.id;
					console.log("Highest ID is now " + $scope.highestId);
				}
			}
		}

		$scope.query = function() {
			CourseInfo.setCourses($scope.courses);
			CourseInfo.setSelectedIndex($scope.courseIdToIndex());
		}

		$scope.modalVars = null;

		$scope.selectedQuestion = 0;
		$scope.answers = [];

		$scope.populateEditTable = function() {
			var index = $scope.courseIdToIndex();
			$scope.modalVars = $scope.courses[index];
//			$scope.questionIdToIndex();
			$scope.answers = $scope.modalVars.questions[$scope.selectedQuestion].answers;
		}

		// Populate list of courses with data from the server
		CourseService.query(function(data) {
			$scope.courses = data;
			$scope.numberOfCourses = data.length;
			$scope.maxId();
		});
	}])

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

        // Add an initial marker
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
                    }/*,
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
                    }*/
                }
            }
        });
    }]);

