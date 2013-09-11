'use strict';

define(['app'], function (app) {

    app.register.controller('CustomerEditController', ['$scope', '$location', '$routeParams', '$timeout', 'config', 'dataService', 'dialogService',
        function ($scope, $location, $routeParams, $timeout, config, dataService, dialogService) {

        var timer;

        $scope.customer = {};
        $scope.states = [];
        $scope.title = 'Edit';
        $scope.buttonText = 'Update';        

        init();

        function init() {
            var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;
            if (customerID > 0) {
                dataService.getCustomer(customerID)
                    .then(function (customer) {
                        $scope.customer = customer;

                        //Get States
                        getStates();
                        dataService.apply($scope); //Handles calling $apply() if needed (mainly for breeze since it's a 3rd party library)

                    }, processError);
            }
            else {
                $scope.title = 'Add';
                $scope.buttonText = 'Add';
                getStates();
            }
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
                if ($scope.customer.id === undefined) {
                    dataService.insertCustomer($scope.customer).then(processSuccess, processError).then(function () {
                        alert('in')
                    });
                }
                else {
                    dataService.updateCustomer($scope.customer).then(processSuccess, processError);
                }
            } else {
                $scope.editForm.submitted = true;
            };

        };

        $scope.deleteCustomer = function () {
            var dialogOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Customer',
                headerText: 'Delete Customer?',
                bodyText: 'Are you sure you want to delete this customer?',
                callback: function () {
                    dataService.deleteCustomer($scope.customer.id).then(function (opStatus) {
                        if (opStatus.status) {
                            $location.path('/customers');
                        }
                        else {
                            processError(new Error(opStatus.message));
                        }
                    }, processError);
                }
            };

            dialogService.showModalDialog({}, dialogOptions);            
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