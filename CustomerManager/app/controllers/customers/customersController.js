'use strict';

define(['app'], function (app) {

    app.register.controller('CustomersController', ['$scope', 'config', 'dataService', 'dialogService',
        function ($scope, config, dataService, dialogService) {

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

        //$scope.insertCustomer = function () {
        //    var customer = angular.copy($scope.newCustomer);
        //    dataService.insertCustomer(customer)
        //        .then(function (opStatus) {
        //            customer.id = opStatus.operationId;
        //            $scope.customers.push(customer);
        //            $scope.newCustomer = {};
        //        }, function (error) {
        //            alert(error.message);
        //        });
        //};

        $scope.deleteCustomer = function (id) {
            var dialogOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Customer',
                headerText: 'Delete Customer?',
                bodyText: 'Are you sure you want to delete this customer?',
                callback: function () {
                    dataService.deleteCustomer(id).then(function (opStatus) {
                        if (opStatus.status) {
                            for (var i = 0; i < $scope.customers.length; i++) {
                                if ($scope.customers[i].id == id) {
                                    $scope.customers.splice(i, 1);
                                    break;
                                }
                            }
                        }
                        else {
                            alert('Error deleting customer: ' + opStatus.message);
                        }
                            
                    }, function (error) {
                        alert('Error deleting customer: ' + error.message);
                    });
                }
            };

            dialogService.showModalDialog({}, dialogOptions);
        };

    }]);

});