angular.module('myApp.controllers')
    .controller('UserInformationController', ['$scope', '$http', 'UserInformationService',
		function($scope, $http, UserInformationService) {
		    
		    $scope.dhisAPI = dhisAPI;
		    
		    $scope.isAdmin = 'no'
		    
		    UserInformationService.query(function (res) {
			// sjekker om brukeren er superuser, og outputter yes/no til variablen isAdmin.
			// bruke gruppe-id fremfor navn
			// todo: gjør den om til true/false
			res.userCredentials.userAuthorityGroups.forEach(function(el) {
			    if('Ufph3mGRmMo' === el.id) {
				$scope.isAdmin = 'yes';
			    }
			});;
		    });
}]);
