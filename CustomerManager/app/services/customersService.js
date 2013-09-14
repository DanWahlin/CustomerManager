'use strict';

define(['app'], function (app) {

    //This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
    //each doing the same thing just structuring the functions/data differently.

    //Although this is an AngularJS factory I prefer the term "service" for data operations
    app.factory('customersService', ['$http', '$q', function ($http, $q) {
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

        customersFactory.getStates = function () {
            return $http.get(serviceBase + 'States').then(
                function (results) {
                    return results.data;
                });                
        }

        customersFactory.checkUniqueValue = function (id, property, value) {
            if (!id) id = 0;
            return $http.get(serviceBase + 'CheckUnique/' + id + '?property=' + property + '&value=' + escape(value)).then(
                function (results) {
                    return results.data.status;
                });
        };

        customersFactory.getCustomersSummary = function () {
            return $http.get(serviceBase + 'CustomersSummary').then(function (results) {
                return results.data;
            });
        };

        customersFactory.insertCustomer = function (customer) {
            return $http.post(serviceBase + 'PostCustomer', customer).then(function (results) {
                customer.id = results.data.id;
                return results.data;
            });
        };

        customersFactory.newCustomer = function () {
            return $q.when({});
        };

        customersFactory.updateCustomer = function (customer) {
            return $http.put(serviceBase + 'PutCustomer/' + customer.id, customer).then(function (status) {
                return status.data;
            });
        };

        customersFactory.deleteCustomer = function (id) {
            return $http.delete(serviceBase + 'DeleteCustomer/' + id).then(function (status) {
                return status.data;
            });
        };

        customersFactory.getCustomer = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'CustomerById/' + id).then(function (results) {
                extendCustomers([results.data]);
                return results.data;
            });
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

    }]);

});