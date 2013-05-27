'use strict';

define(['app'], function (app) {

    //This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
    //each doing the same thing just structuring the functions/data differently.

    //Although this is an AngularJS factory I prefer the term "service" for data operations
    app.factory('customersService', function ($http) {
        var serviceBase = '/api/dataservice/',
            customers = null,
            customersFactory = {};

        customersFactory.getCustomers = function () {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'Customers').then(function (results) {
                extendCustomers(results.data);
                return results.data;
            });
        };

        customersFactory.getCustomersSummary = function () {
            return $http.get(serviceBase + 'CustomersSummary').then(function (results) {
                return results.data;
            });
        };

        customersFactory.insertCustomer = function (firstName, lastName, city) {
            var topID = customers.length + 1;
            customers.push({
                id: topID,
                firstName: firstName,
                lastName: lastName,
                city: city
            });
        };

        customersFactory.updateCustomer = function (customer) {
            return $http.put(serviceBase + 'UpdateCustomer/' + customer.id, customer).then(function (status) {
                return status.data;
            });
        };

        customersFactory.deleteCustomer = function (id) {
            for (var i = customers.length - 1; i >= 0; i--) {
                if (customers[i].id === id) {
                    customers.splice(i, 1);
                    break;
                }
            }
        };

        customersFactory.getCustomer = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'CustomerById/' + id).then(function (results) {
                extendCustomers([results.data]);
                return results.data;
            });
        };

        //Can't call $scope.$apply() for this one since $http is already handling it
        //This is hear since the Breeze service needs a call to apply and we can switch between the two easily
        customersFactory.apply = function (scope) {

        };

        function extendCustomers(customers) {
            var custsLen = customers.length;
            //Iterate through customers
            for (var i = 0; i < custsLen; i++) {
                var cust = customers[i];
                var ordersLen = cust.orders.length;
                for (var j = 0; j < ordersLen; j++) {
                    var order = cust.orders[j];
                    order.orderTotal = function () { return orderTotal(this); };
                }
                cust.ordersTotal = function () { return ordersTotal(this); };
            }
        }

        function orderTotal(order) {
            return order.quantity * order.price;
        };

        function ordersTotal(customer) {
            var total = 0;
            var orders = customer.orders;
            var count = orders.length;

            for (var i = 0; i < count; i++) {
                total += orders[i].orderTotal();
            }
            return total;

        };

        return customersFactory;

    });

});