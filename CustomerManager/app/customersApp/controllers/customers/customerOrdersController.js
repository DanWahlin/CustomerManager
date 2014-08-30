'use strict';

define(['app'], function (app) {
    
    var CustomerOrdersController = function ($scope, $routeParams, $window, dataService) {
        //Grab customerId off of the route        
        var customerId = ($routeParams.customerId) ? parseInt($routeParams.customerId) : 0;

        $scope.customer = {};
        $scope.ordersTotal = 0.00;

        init();

        function init() {
            if (customerId > 0) {
                dataService.getCustomer(customerId)
                .then(function (customer) {
                    $scope.customer = customer;
                }, function (error) {
                    $window.alert("Sorry, an error occurred: " + error.message);
                });
            }
        }
    };

    CustomerOrdersController.$inject = ['$scope', '$routeParams', '$window', 'dataService'];

    app.register.controller('CustomerOrdersController', CustomerOrdersController);

});