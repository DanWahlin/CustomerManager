'use strict';

define(['app'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is ultimately bound to the customers view
    app.register.controller('CustomersController', ['$scope', 'config', 'dataService', function ($scope, config, dataService) {

        //I like to have an init() for controllers that need to perform some initialization. Keeps things in
        //one place...not required though especially in the simple example below
        init();

        function init() {
            dataService.getCustomersSummary()
                .then(function (customers) {
                    $scope.customers = customers;
                    dataService.apply($scope); //Handles calling $apply() if needed
                }, function (error) {
                    alert(error.message);
                });
        }

        $scope.insertCustomer = function () {
            var customer = angular.copy($scope.newCustomer);
            dataService.insertCustomer(customer)
                .then(function (opStatus) {
                    customer.id = opStatus.operationId;
                    $scope.customers.push(customer);
                    $scope.newCustomer = {};
                }, function (error) {
                    alert(error.message);
                });
        };

        $scope.deleteCustomer = function (id) {
            dataService.deleteCustomer(id);
        };
    }]);

});