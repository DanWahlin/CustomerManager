'use strict';

define(['app'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is bound to the order view
    app.register.controller('CustomerOrdersController', ['$scope', '$routeParams', 'dataService', function ($scope, $routeParams, dataService) {
        $scope.customer = {};
        $scope.ordersTotal = 0.00;

        //I like to have an init() for controllers that need to perform some initialization. Keeps things in
        //one place...not required though especially in the simple example below
        init();

        function init() {
            //Grab customerID off of the route        
            var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;
            if (customerID > 0) {
                dataService.getCustomer(customerID)
                .then(function (customer) {
                    $scope.customer = customer;
                    dataService.apply($scope);
                }, function (error) {
                    alert(error.message);
                });
            }
        }

    }]);

});