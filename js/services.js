'use strict';

/* It has become considered better practise to separate services into
 different files. Not like it's done here. See angular-seed for an example
 of how it's done (this is based on angular-seed one year ago.
 */

/* Services */

var myAppServices = angular.module('myApp.services', ['ngResource']);

myAppServices.factory("MeService", function ($resource) {
    return $resource(
        dhisAPI+'/api/me',
        {
            // If you're passing variables, for example into the URL
            // they would be here and then as :varName in the URL
        },
        {
            // If you want to implement special functions, you'd
            // put them here.
        }
    );
});

myAppServices.factory("ProfileService", function ($resource) {
    return $resource(
            dhisAPI+'/api/me/profile',
        {
            // If you're passing variables, for example into the URL
            // they would be here and then as :varName in the URL
        },
        {
            // If you want to implement special functions, you'd
            // put them here.
        }
    );
});

myAppServices.factory("UserInformationService", function ($resource) {
    return $resource(
            dhisAPI+'/api/me',
        {
            // If you're passing variables, for example into the URL
            // they would be here and then as :varName in the URL
        },
        {
            // If you want to implement special functions, you'd
            // put them here.

	    // query
	    query: {
		method:'GET',
		isArray:false,
		headers: {'Content-Type': 'application/json'}
	    },
        }
    );
});

myAppServices.factory("UserSettingService", function ($resource) {
    return $resource(
            dhisAPI+'/api/userSettings/exampleapp.usersetting',
        {
            // If you're passing variables, for example into the URL
            // they would be here and then as :varName in the URL
        },
        {
            // If you want to implement special functions, you'd
            // put them here. In this case, the content type cannot be
            // JSON, so we need to change it to text/plain
            save: {
                method:'POST',
                isArray:false,
                headers: {'Content-Type': 'text/plain'}}
        }
    );
});

myAppServices.factory("CourseService", function($resource) {
	return $resource(dhisAPI + '/api/systemSettings/courses',
	{
		
	},
	{
		query: {
			method:'GET',
			isArray:true,
			headers: {'Content-Type': 'application/json'}
		},
		save: {
			method:'POST',
			isArray:true,
			headers: {'Content-Type': 'text/plain'}}
	});
});
