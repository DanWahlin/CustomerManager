'use strict';

define(['app'], function (app) {

    app.register.controller('CustomersController', ['$scope', '$location', 'config', 'dataService', 'dialogService',
        function ($scope, $location, config, dataService, dialogService) {

        $scope.customers = [];

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

        function getCustomerById(id) {
            for (var i = 0; i < $scope.customers.length; i++) {
                var cust = $scope.customers[i];
                if (cust.id === id) {
                    return cust;
                }
            }
        }        

        $scope.deleteCustomer = function (id) {
            var cust = getCustomerById(id);
            var custName = cust.firstName + ' ' + cust.lastName;

            var dialogOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Customer',
                headerText: 'Delete ' + custName + '?',
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

        $scope.ViewEnum = {
            Card: 0,
            List: 1
        }

        $scope.changeView = function (view) {
            switch (view) {
                case $scope.ViewEnum.Card:
                    $scope.listViewEnabled = false;
                    break;
                case $scope.ViewEnum.List:
                    $scope.listViewEnabled = true;
                    break;
            }
        }

        $scope.navigate = function (url) {
            $location.path(url);
        }

    }]);

});