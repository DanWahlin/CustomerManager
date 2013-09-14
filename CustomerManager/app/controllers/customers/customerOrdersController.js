'use strict';

define(['app'], function (app) {

    app.register.controller('CustomerOrdersController', ['$scope', '$routeParams', 'dataService', function ($scope, $routeParams, dataService) {
        //Grab customerID off of the route        
        var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;

        $scope.customer = {};
        $scope.ordersTotal = 0.00;

        init();

        function init() {
            if (customerID > 0) {
                dataService.getCustomer(customerID)
                .then(function (customer) {
                    $scope.customer = customer;
                }, function (error) {
                    alert(error.message);
                });
            }
        }

    }]);

});