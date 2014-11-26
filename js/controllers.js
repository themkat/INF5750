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
	controller('CoursesCtrl', ['$scope', '$http', '$location', 'CourseService',
		function ($scope, $http, $location, CourseService) {

		/* DUMMY COURSES */
		$scope.courses  = [
/*				{
					id:"Rp268JB6Ne4",
					created:"2012-02-17T14:54:39.987+0000",
					name:"TAB Science: One tab equals eight characters",
					lastUpdated:"2014-03-02T21:16:00.548+0000",
					code:"OU_651071",
					href:"http://inf5750-17.uio.no/api/organisationUnits/Rp268JB6Ne4",
					description:"Failing this test will permanently revoke your access to the DHIS2 system."
				},
				{
					id:"Rp268JB6Ne4",
					created:"2012-02-17T14:54:39.987+0000",
					name:"Adonkia CHP",
					lastUpdated:"2014-03-02T21:16:00.548+0000",
					code:"OU_651071",
					href:"http://inf5750-17.uio.no/api/organisationUnits/Rp268JB6Ne4",
					description:"This text makes no sense."
				},
				{
					id:"cDw53Ej8rju",
					created:"2012-02-17T14:54:39.987+0000",
					name:"Afro Arab Clinic",
					lastUpdated:"2014-03-02T21:16:07.293+0000",
					code:"OU_278371",
					href:"http://inf5750-17.uio.no/api/organisationUnits/cDw53Ej8rju",
					description:"This whole thing is just ridiculous."
				},
				{
					id:"cDw53Ej8rju",
					created:"2012-02-17T14:54:39.987+0000",
					name:"Martin's course of violence",
					lastUpdated:"2014-03-02T21:16:07.293+0000",
					code:"OU_278371",
					href:dhisAPI + "/organisationUnits/cDw53Ej8rju",
					description:"Learn how to tackle challenges by shooting them in the face."
				},
				{
					id:"cDw53Ej8rju",
					created:"2012-02-17T14:54:39.987+0000",
					name:"Oh hey there JavaScript",
					lastUpdated:"2014-03-02T21:16:07.293+0000",
					code:"OU_278371",
					href:"http://inf5750-17.uio.no/api/organisationUnits/cDw53Ej8rju",
					description:"Seems like you have to cooperate after all."
				},
				{
					id:"cDw53Ej8rju",
					created:"2012-02-17T14:54:39.987+0000",
					name:"Stupidity and horrific coding practices",
					lastUpdated:"201:4-03-02T21:16:07.293+0000",
					code:"OU_278371",
					href:"http://inf5750-17.uio.no/api/organisationUnits/cDw53Ej8rju",
					description:"A basic introduction to religious techno-babble."
				} */
			]

		$scope.courseIdToIndex = function() {
			for (var i = 0; i < $scope.numberOfCourses; i++) {
				if ($scope.courses[i].id == $scope.selectedCourseIndex) {
					return i;
				}
			}
		}

		// Array Remove - authored by John Resig (MIT Licensed)
		Array.prototype.remove = function(from, to) {
			var rest = this.slice((to || from) + 1 || this.length);
			this.length = from < 0 ? this.length + from : from;
			return this.push.apply(this, rest);
		}

		$scope.numberOfCourses = 0;

		$scope.deleteCourse = function() {
			var modCourses = $scope.courses;
			console.log("Course to delete: " + $scope.selectedCourseIndex);
			console.log(modCourses[$scope.courseIdToIndex()]);
			modCourses.remove($scope.courseIdToIndex());
			CourseService.save(modCourses);
			$scope.courses = modCourses;
		}


		$scope.deleteCourses = function() {	
			CourseService.delete({});
			$scope.courses = [];
			$scope.numberOfCourses = 0;
		/*	CourseService.query(function(data) {
				$scope.courses = data;
				$scope.numberOfCourses = courses.length;
			});
		*/
			/*$http.delete(dhisAPI + '/api/systemSettings/courses').
				success(function() {
					console.log("Deleted successfully.");
				}).
				error(function() {
					console.log("Oh no!");
				});*/
		}

		$scope.createCourse = function() {
			
			var addedCourse = {
				'id': ++$scope.numberOfCourses,
				'name': "Course " + $scope.numberOfCourses
			};

			var courses = $scope.courses;
			console.log(courses);

			courses.push(addedCourse);
			console.log(courses);
			CourseService.save(courses);
		};
		
		$scope.selectedCourseIndex = 0;
		
		$scope.itemClicked = function ($index) {
		    $scope.selectedCourseIndex = $index;
		};

		CourseService.query(function(data) {
			$scope.courses = data;
			$scope.numberOfCourses = data.length;
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

