'use strict';

define(['app'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is bound to the orders view
    app.register.controller('OrdersController', ['$scope', 'dataService', function ($scope, dataService) {
        $scope.customers = [];

        init();

        function init() {
            dataService.getCustomers()
                .then(function (customers) {
                    $scope.customers = customers;
                    dataService.apply($scope);
                }, function (error) {
                    alert(error.message);
                });
        }
    }]);

});