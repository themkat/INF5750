angular.module('myApp.controllers')
	.controller('UserInformationController', ['$scope', '$http', 'UserInformationService',
		function($scope, $http, UserInformationService) {
			$scope.dhisAPI = dhisAPI;
			UserInformationService.query(function (res) {
				$scope.userInformation = res;
				$scope.isQuizAdmin = false;
				res.groups.forEach(function(group) {
					//$scope.isAdmin = false;
					//return;
					$scope.isAdmin = 
						$scope.isAdmin
							? true : 
						"Administrators" === group.name
							? true : 
						"System administrators" === group.name
							? true : 
						"Quiz" === group.name
							? true : false;
				});
			});
	}]);
