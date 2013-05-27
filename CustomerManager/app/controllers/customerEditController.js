'use strict';

define(['app'], function (app) {

    app.register.controller('CustomerEditController', ['$scope', '$routeParams', 'config', 'dataService', function ($scope, $routeParams, config, dataService) {

        init();

        function init() {
            var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;
            dataService.getCustomer(customerID)
                .then(function (customer) {
                    $scope.customer = customer;
                    dataService.apply($scope); //Handles calling $apply() if needed (mainly for breeze since it's a 3rd party library)
                }, function (error) {
                    alert(error.message);
                });
        }

        $scope.updateCustomer = function () {
            dataService.updateCustomer($scope.customer)
                .then(function (opStatus) {
                    $scope.updateStatus = opStatus.status;
                    $scope.errorMessage = (opStatus.status) ? '' : opStatus.message;                    
                }, function (error) {
                    $scope.errorMessage = error.message;
                });
                

        }
    }]);

});