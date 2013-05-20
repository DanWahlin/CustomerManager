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
            var firstName = $scope.newCustomer.firstName;
            var lastName = $scope.newCustomer.lastName;
            var city = $scope.newCustomer.city;
            dataService.insertCustomer(firstName, lastName, city);
            $scope.newCustomer.firstName = '';
            $scope.newCustomer.lastName = '';
            $scope.newCustomer.city = '';
        };

        $scope.deleteCustomer = function (id) {
            dataService.deleteCustomer(id);
        };
    }]);

});