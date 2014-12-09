'use strict';

define(['customersApp/services/routeResolver'], function () {

    var app = angular.module('customersApp', ['ngRoute', 'ngAnimate', 'routeResolverServices',
                                              'wc.directives', 'wc.animations', 'ui.bootstrap', 'breeze.angular']);

    app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider',
                '$compileProvider', '$filterProvider', '$provide', '$httpProvider',

        function ($routeProvider, routeResolverProvider, $controllerProvider,
                  $compileProvider, $filterProvider, $provide, $httpProvider) {

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
                //route.resolve() now accepts the convention to use (name of controller & view) as well as the 
                //path where the controller or view lives in the controllers or views folder if it's in a sub folder. 
                //For example, the controllers for customers live in controllers/customers and the views are in views/customers.
                //The controllers for orders live in controllers/orders and the views are in views/orders
                //The second parameter allows for putting related controllers/views into subfolders to better organize large projects
                //Thanks to Ton Yeung for the idea and contribution
                .when('/customers', route.resolve('Customers', 'customers/', 'vm'))
                .when('/customerorders/:customerId', route.resolve('CustomerOrders', 'customers/', 'vm'))
                .when('/customeredit/:customerId', route.resolve('CustomerEdit', 'customers/', 'vm', true))
                .when('/orders', route.resolve('Orders', 'orders/', 'vm'))
                .when('/about', route.resolve('About', '', 'vm'))
                .when('/login/:redirect*?', route.resolve('Login', '', 'vm'))
                .otherwise({ redirectTo: '/customers' });

    }]);

    app.run(['$rootScope', '$location', 'authService',
        function ($rootScope, $location, authService) {
            
            //Client-side security. Server-side framework MUST add it's 
            //own security as well since client-based security is easily hacked
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (next && next.$$route && next.$$route.secure) {
                    if (!authService.user.isAuthenticated) {
                        $rootScope.$evalAsync(function () {
                            authService.redirectToLogin();
                        });
                    }
                }
            });

    }]);

    return app;

});





