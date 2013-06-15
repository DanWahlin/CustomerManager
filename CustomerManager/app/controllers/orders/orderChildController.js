'use strict';

define(['app'], function (app) {

    //This controller is a child controller that will inherit functionality from a parent
    //It's used to track the orderby parameter and ordersTotal for a customer. Put it here rather than duplicating 
    //setOrder and orderby across multiple controllers.
    app.controller('OrderChildController', ['$scope', function ($scope) {
        $scope.orderby = 'product';
        $scope.reverse = false;
        $scope.ordersTotal = 0.00;

        init();

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

        $scope.setOrder = function (orderby) {
            if (orderby === $scope.orderby) {
                $scope.reverse = !$scope.reverse;
            }
            $scope.orderby = orderby;
        };

    }]);
});