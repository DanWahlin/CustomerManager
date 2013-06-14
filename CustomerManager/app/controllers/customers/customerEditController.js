﻿'use strict';

define(['app'], function (app) {

    app.register.controller('CustomerEditController', ['$scope', '$routeParams', '$timeout', 'config', 'dataService', function ($scope, $routeParams, $timeout, config, dataService) {

        var timer;

        $scope.customer = {};
        $scope.title = 'Edit';
        $scope.buttonText = 'Update';        

        init();

        function init() {
            var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;
            if (customerID > 0) {
                dataService.getCustomer(customerID)
                    .then(function (customer) {
                        $scope.customer = customer;
                        dataService.apply($scope); //Handles calling $apply() if needed (mainly for breeze since it's a 3rd party library)
                    }, processError);
            }
            else {
                $scope.title = 'Add';
                $scope.buttonText = 'Add';
            }
        }

        $scope.saveCustomer = function () {
            if ($scope.customer.id === undefined) {
                dataService.insertCustomer($scope.customer).then(processSuccess, processError).then(function () {
                    alert('in')
                });
            }
            else {
                dataService.updateCustomer($scope.customer).then(processSuccess, processError);
            }
        };

        $scope.delete = function () {
            dataService.deleteCustomer($scope.customer.id).then(processSuccess, processError);
        };

        function processSuccess(opStatus) {
            $scope.updateStatus = opStatus.status;
            $scope.errorMessage = (opStatus.status) ? '' : opStatus.message;
            startTimer();
        }

        function processError(error) {
            $scope.errorMessage = error.message;
            startTimer();
        }

        function startTimer() {
            timer = $timeout(function () {
                $timeout.cancel(timer);
                $scope.errorMessage = '';
                $scope.updateStatus = false;
            }, 3000);
        }

    }]);

});