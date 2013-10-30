'use strict';

define(['app'], function (app) {

    var customersService = function ($http, $q) {
        var serviceBase = '/api/dataservice/',
            customers = null,
            customersFactory = {};

        customersFactory.getCustomers = function (pageIndex, pageSize) {
            return getPagedResource('customers', pageIndex, pageSize);
        };

        customersFactory.getCustomersSummary = function (pageIndex, pageSize) {
            return getPagedResource('customersSummary', pageIndex, pageSize);
        };

        customersFactory.getStates = function () {
            return $http.get(serviceBase + 'states').then(
                function (results) {
                    return results.data;
                });
        }

        customersFactory.checkUniqueValue = function (id, property, value) {
            if (!id) id = 0;
            return $http.get(serviceBase + 'checkUnique/' + id + '?property=' + property + '&value=' + escape(value)).then(
                function (results) {
                    return results.data.status;
                });
        };

        customersFactory.insertCustomer = function (customer) {
            return $http.post(serviceBase + 'postCustomer', customer).then(function (results) {
                customer.id = results.data.id;
                return results.data;
            });
        };

        customersFactory.newCustomer = function () {
            return $q.when({});
        };

        customersFactory.updateCustomer = function (customer) {
            return $http.put(serviceBase + 'putCustomer/' + customer.id, customer).then(function (status) {
                return status.data;
            });
        };

        customersFactory.deleteCustomer = function (id) {
            return $http.delete(serviceBase + 'deleteCustomer/' + id).then(function (status) {
                return status.data;
            });
        };

        customersFactory.getCustomer = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'customerById/' + id).then(function (results) {
                extendCustomers([results.data]);
                return results.data;
            });
        };

        function extendCustomers(customers) {
            var custsLen = customers.length;
            //Iterate through customers
            for (var i = 0; i < custsLen; i++) {
                var cust = customers[i];
                if (!cust.orders) cust.orders = [];

                var ordersLen = cust.orders.length;
                for (var j = 0; j < ordersLen; j++) {
                    var order = cust.orders[j];
                    order.orderTotal = order.quantity * order.price;
                }
                cust.ordersTotal = ordersTotal(cust);
            }
        }

        function getPagedResource(baseResource, pageIndex, pageSize) {
            var resource = baseResource;
            resource += (arguments.length == 3) ? buildPagingUri(pageIndex, pageSize) : '';
            return $http.get(serviceBase + resource).then(function (response) {
                var custs = response.data;
                extendCustomers(custs);
                return {
                    totalRecords: parseInt(response.headers('X-InlineCount')),
                    results: custs
                };
            });
        }

        function buildPagingUri(pageIndex, pageSize) {
            var uri = '?$top=' + pageSize + '&$skip=' + (pageIndex * pageSize);
            return uri;
        }


        function orderTotal(order) {
            return order.quantity * order.price;
        };

        function ordersTotal(customer) {
            var total = 0;
            var orders = customer.orders;
            var count = orders.length;

            for (var i = 0; i < count; i++) {
                total += orders[i].orderTotal;
            }
            return total;
        };

        return customersFactory;

    };

    app.factory('customersService', ['$http', '$q', customersService]);

});