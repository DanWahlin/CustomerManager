/*#######################################################################
  
  Dan Wahlin
  http://twitter.com/DanWahlin
  http://weblogs.asp.net/dwahlin
  http://pluralsight.com/training/Authors/Details/dan-wahlin

  Ward Bell - Breeze Integration
  http://twitter.com/WardBell
  http://neverindoubtnet.blogspot.com

  #######################################################################*/

'use strict';

define(['services/routeResolver'], function () {

    var app = angular.module('customersApp', ['routeResolverServices', 'CustomAnimations', '$strap']);

    app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
        function ($routeProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

            //Change default views and controllers directory using the following:
            //routeResolverProvider.routeConfig.setBaseDirectories('/app/views', '/app/controllers');

            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            //Define routes - controllers will be loaded dynamically
            var route = routeResolverProvider.route;

            $routeProvider
                .when('/customers', route.resolve('Customers'))
                .when('/customerorders/:customerID', route.resolve('CustomerOrders'))
                .when('/customeredit/:customerID', route.resolve('CustomerEdit'))
                .when('/orders', route.resolve('Orders'))
                .otherwise({ redirectTo: '/customers' });

    }]);

    return app;
});





