'use strict';

define(['app'], function (app) {
    
    var CustomersController = function ($scope, $location, $filter, $window,
                                        $timeout, authService, dataService, modalService) {

        $scope.customers = [];
        $scope.filteredCustomers = [];
        $scope.filteredCount = 0;
        $scope.orderby = 'lastName';
        $scope.reverse = false;
        $scope.searchText = null;
        $scope.cardAnimationClass = 'card-animation';

        //paging
        $scope.totalRecords = 0;
        $scope.pageSize = 5;
        $scope.currentPage = 1;

        $scope.pageChanged = function (page) {
            $scope.currentPage = page;
            getCustomersSummary();
        };

        $scope.deleteCustomer = function (id) {
            if (!authService.user.isAuthenticated) {
                $location.path(authService.loginPath + $location.$$path);
                return;
            }

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
                        $window.alert('Error deleting customer: ' + error.message);
                    });
                }
            });
        };

        $scope.DisplayModeEnum = {
            Card: 0,
            List: 1
        };

        $scope.changeDisplayMode = function (displayMode) {
            switch (displayMode) {
                case $scope.DisplayModeEnum.Card:
                    $scope.listDisplayModeEnabled = false;
                    break;
                case $scope.DisplayModeEnum.List:
                    $scope.listDisplayModeEnabled = true;
                    break;
            }
        };

        $scope.navigate = function (url) {
            $location.path(url);
        };

        $scope.setOrder = function (orderby) {
            if (orderby === $scope.orderby) {
                $scope.reverse = !$scope.reverse;
            }
            $scope.orderby = orderby;
        };

        $scope.searchTextChanged = function () {
            filterCustomers($scope.searchText);
        };

        function init() {
            //createWatches();
            getCustomersSummary();
        }

        //function createWatches() {
        //    //Watch searchText value and pass it and the customers to nameCityStateFilter
        //    //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
        //    //while also accessing the filtered count via $scope.filteredCount above

        //    //Better to handle this using ng-change on <input>. See searchTextChanged() function.
        //    $scope.$watch("searchText", function (filterText) {
        //        filterCustomers(filterText);
        //    });
        //}

        function getCustomersSummary() {
            dataService.getCustomersSummary($scope.currentPage - 1, $scope.pageSize)
            .then(function (data) {
                $scope.totalRecords = data.totalRecords;
                $scope.customers = data.results;
                filterCustomers(''); //Trigger initial filter

                $timeout(function () {
                    $scope.cardAnimationClass = ''; //Turn off animation since it won't keep up with filtering
                }, 1000);

            }, function (error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
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
            return null;
        }

        init();
    };

    CustomersController.$inject = ['$scope', '$location', '$filter', '$window', '$timeout',
                                   'authService', 'dataService', 'modalService'];

    app.register.controller('CustomersController', CustomersController);

});