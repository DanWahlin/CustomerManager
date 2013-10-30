'use strict';

define(['app'], function (app) {
    
    var customersController = function ($scope, $location, $filter, dataService, modalService) {

        $scope.customers = [];
        $scope.filteredCustomers = [];
        $scope.filteredCount = 0;
        $scope.orderby = 'lastName';
        $scope.reverse = false;

        //paging
        $scope.totalRecords = 0;
        $scope.pageSize = 10;
        $scope.currentPage = 1;

        init();

        $scope.pageChanged = function (page) {
            $scope.currentPage = page;
            getCustomersSummary();
        };

        $scope.deleteCustomer = function (id) {
            var cust = getCustomerById(id);
            var custName = cust.firstName + ' ' + cust.lastName;

            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Customer',
                headerText: 'Delete ' + custName + '?',
                bodyText: 'Are you sure you want to delete this customer?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteCustomer(id).then(function () {
                        for (var i = 0; i < $scope.customers.length; i++) {
                            if ($scope.customers[i].id == id) {
                                $scope.customers.splice(i, 1);
                                break;
                            }
                        }
                        filterCustomers($scope.searchText);
                    }, function (error) {
                        alert('Error deleting customer: ' + error.message);
                    });
                }
            });
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

        $scope.setOrder = function (orderby) {
            if (orderby === $scope.orderby) {
                $scope.reverse = !$scope.reverse;
            }
            $scope.orderby = orderby;
        };

        function init() {
            createWatches();
            getCustomersSummary();
        }

        function createWatches() {
            //Watch searchText value and pass it and the customers to nameCityStateFilter
            //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
            //while also accessing the filtered count via $scope.filteredCount above
            $scope.$watch("searchText", function (filterText) {
                filterCustomers(filterText);
            });
        }

        function getCustomersSummary() {
            dataService.getCustomersSummary($scope.currentPage - 1, $scope.pageSize)
            .then(function (data) {
                $scope.totalRecords = data.totalRecords;
                $scope.customers = data.results;
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

    };

    app.register.controller('CustomersController',
        ['$scope', '$location', '$filter', 'dataService', 'modalService', customersController]);

});