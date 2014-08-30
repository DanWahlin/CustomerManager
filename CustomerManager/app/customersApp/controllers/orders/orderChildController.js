'use strict';

define(['app'], function (app) {

    var OrderChildController = function ($scope) {
        $scope.orderby = 'product';
        $scope.reverse = false;
        $scope.ordersTotal = 0.00;

        init();

        $scope.setOrder = function (orderby) {
            if (orderby === $scope.orderby) {
                $scope.reverse = !$scope.reverse;
            }
            $scope.orderby = orderby;
        };

        function init() {
            //Calculate grand total
            //Handled at this level so we don't duplicate it across parent controllers
            if ($scope.customer && $scope.customer.orders) {
                var total = 0.00;
                for (var i = 0; i < $scope.customer.orders.length; i++) {
                    var order = $scope.customer.orders[i];
                    total += order.orderTotal;
                }
                $scope.ordersTotal = total;
            }
        }
    };

    OrderChildController.$inject = ['$scope'];

    app.controller('OrderChildController', OrderChildController);
});