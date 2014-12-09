'use strict';

define(['app'], function (app) {

    var injectParams = ['$filter', '$window', 'dataService'];

    var OrdersController = function ($filter, $window, dataService) {
        var vm = this;

        vm.customers = [];
        vm.filteredCustomers;
        vm.filteredCount;

        //paging
        vm.totalRecords = 0;
        vm.pageSize = 10;
        vm.currentPage = 1;

        init();

        vm.pageChanged = function (page) {
            vm.currentPage = page;
            getCustomers();
        };

        vm.searchTextChanged = function () {
            filterCustomersProducts(vm.searchText);
        };

        function init() {
            //createWatches();
            getCustomers();
        }

        //function createWatches() {
        //    //Watch searchText value and pass it and the customers to nameCityStateFilter
        //    //Doing this instead of adding the filter to ng-repeat allows it to only be run once (rather than twice)
        //    //while also accessing the filtered count via vm.filteredCount above

        //    //Better to handle this using ng-change on <input>. See searchTextChanged() function.
        //    $scope.$watch("searchText", function (filterText) {
        //        filterCustomersProducts(filterText);
        //    });
        //}

        function filterCustomersProducts(filterText) {
            vm.filteredCustomers = $filter("nameProductFilter")(vm.customers, filterText);
            vm.filteredCount = vm.filteredCustomers.length;
        }

        function getCustomers() {
            dataService.getCustomers(vm.currentPage - 1, vm.pageSize)
                .then(function (data) {
                    vm.totalRecords = data.totalRecords;
                    vm.customers = data.results;
                    filterCustomersProducts('');
                }, function (error) {
                    $window.alert(error.message);
                });
        }
    };

    OrdersController.$inject = injectParams;

    app.register.controller('OrdersController', OrdersController);

});