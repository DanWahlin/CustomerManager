'use strict';

define(['app'], function (app) {

    app.register.controller('CustomerEditController', ['$scope', '$location', '$routeParams', '$timeout', 'config', 'dataService', 'dialogService',
        function ($scope, $location, $routeParams, $timeout, config, dataService, dialogService) {

        var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0,
            timer;

        $scope.customer;
        $scope.states = [];
        $scope.title = (customerID > 0) ? 'Edit' : 'Add';
        $scope.buttonText = (customerID > 0) ? 'Update' : 'Add';
        $scope.updateStatus = false;
        $scope.errorMessage = '';

        init();

        function init() {
            if (customerID > 0) {
                dataService.getCustomer(customerID).then(function (customer) {
                    $scope.customer = customer;
                }, processError);
            } else {
                dataService.newCustomer().then(function (customer) {
                    $scope.customer = customer;
                });
                
            }
            getStates();
        }

        function getStates() {
            dataService.getStates().then(function (states) {
                $scope.states = states;
            }, processError);
        }

        $scope.isStateSelected = function (customerStateId, stateId) {
            return customerStateId === stateId;
        };

        $scope.saveCustomer = function () {
            if ($scope.editForm.$valid) {
                if (!$scope.customer.id) {
                    dataService.insertCustomer($scope.customer).then(processSuccess, processError);
                }
                else {
                    dataService.updateCustomer($scope.customer).then(processSuccess, processError);
                }
            }
        };

        $scope.deleteCustomer = function () {
            var dialogOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Customer',
                headerText: 'Delete Customer?',
                bodyText: 'Are you sure you want to delete this customer?',
                callback: function () {
                    dataService.deleteCustomer($scope.customer.id).then(function () {
                        $location.path('/customers');
                    }, processError);
                }
            };

            dialogService.showModalDialog({}, dialogOptions);            
        };

        function processSuccess() {
            $scope.updateStatus = true;
            $scope.title = 'Edit';
            $scope.buttonText = 'Update';
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