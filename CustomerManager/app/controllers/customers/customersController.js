'use strict';

define(['app'], function (app) {

    app.register.controller('CustomersController', ['$scope', '$location', '$filter', 'dataService', 'dialogService',
        function ($scope, $location, $filter, dataService, dialogService) {

        $scope.customers = [];
        $scope.filteredCustomers = [];
        $scope.filteredCount = 0;

        //Watch searchText value and pass it and the customers to nameCityStateFilter
        //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
        //while also accessing the filtered count via $scope.filteredCount above
        $scope.$watch("searchText", function (filterText) {
            filterCustomers(filterText);
        });

        init();

        function init() {
            dataService.getCustomersSummary()
                .then(function (customers) {
                    $scope.customers = customers;
                    filterCustomers(''); //Trigger initial filter
                }, function (error) {
                    alert(error.message);
                });
        }

        function filterCustomers(filterText) {
            $scope.filteredCustomers = $filter("nameCityStateFilter")($scope.customers, filterText);
            $scope.filteredCount = $scope.filteredCustomers.length;
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
                    dataService.deleteCustomer(id).then(function () {
                        for (var i = 0; i < $scope.customers.length; i++) {
                            if ($scope.customers[i].id == id) {
                                $scope.customers.splice(i, 1);
                                break;
                            }
                        }
                        filterCustomers($scope.filterText);                            
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