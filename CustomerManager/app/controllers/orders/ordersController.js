'use strict';

define(['app'], function (app) {

    //This controller retrieves data from the customersService and associates it with the $scope
    //The $scope is bound to the orders view
    var ordersController = function ($scope, dataService) {
        $scope.customers = [];

        //paging
        $scope.totalRecords = 0;
        $scope.pageSize = 10;
        $scope.currentPage = 1;

        init();

        function init() {
            getCustomers();
        }

        $scope.pageChanged = function (page) {
            $scope.currentPage = page;
            getCustomers();
        };

        function getCustomers() {
            dataService.getCustomers($scope.currentPage - 1, $scope.pageSize)
                .then(function (data) {
                    $scope.totalRecords = data.totalRecords;
                    $scope.customers = data.results;
                }, function (error) {
                    alert(error.message);
                });
        }

    };

    app.register.controller('OrdersController', ['$scope', 'dataService', ordersController]);

});