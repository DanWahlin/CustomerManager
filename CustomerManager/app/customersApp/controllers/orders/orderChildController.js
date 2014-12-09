'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope'];

    var OrderChildController = function ($scope) {
        var vm = this;

        vm.orderby = 'product';
        vm.reverse = false;
        vm.ordersTotal = 0.00;
        vm.customer;

        init();

        vm.setOrder = function (orderby) {
            if (orderby === vm.orderby) {
                vm.reverse = !vm.reverse;
            }
            vm.orderby = orderby;
        };

        function init() {
            if ($scope.customer) {
                vm.customer = $scope.customer;
                updateTotal($scope.customer);
            }
            else {
                $scope.$on('customer', function (event, customer) {
                    vm.customer = customer;
                    updateTotal(customer);
                });
            }
        }

        function updateTotal(customer) {
            var total = 0.00;
            for (var i = 0; i < customer.orders.length; i++) {
                var order = customer.orders[i];
                total += order.orderTotal;
            }
            vm.ordersTotal = total;
        }
    };

    OrderChildController.$inject = injectParams;

    app.controller('OrderChildController', OrderChildController);
});