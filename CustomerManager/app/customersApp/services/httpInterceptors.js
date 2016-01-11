'use strict';

define(['app'], function (app) {

    app.config(['$httpProvider', function ($httpProvider) {

        var injectParams = ['$q', '$rootScope'];

        var httpInterceptor401 = function ($q, $rootScope) {

            var success = function (response) {
                return response;
            };

            var error = function (res) {
                if (res.status === 401) {
                    //Raise event so listener (navbarController) can act on it
                    $rootScope.$broadcast('redirectToLogin', null);
                    return $q.reject(res);
                }
                return $q.reject(res);
            };

            return {
                request: function (config) {
                    return config || $q.when(config);
                },
                requestError: function (rejection) {
                    return error(rejection);
                },
                response: function (response) {
                    return response || $q.when(response);
                },
                responseError: function (rejection) {
                    return error(rejection);
                }
            }; 

        };

        httpInterceptor401.$inject = injectParams;

        $httpProvider.interceptors.push(httpInterceptor401);

    }]);
    
});
