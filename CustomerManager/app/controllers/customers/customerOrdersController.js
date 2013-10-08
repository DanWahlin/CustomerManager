'use strict';

define(['app'], function (app) {
    
    var customerOrdersController = function ($scope, $routeParams, dataService) {
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

    };

    app.register.controller('CustomerOrdersController',
        ['$scope', '$routeParams', 'dataService', customerOrdersController]);

});