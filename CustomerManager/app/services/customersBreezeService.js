'use strict';

define(['app'], function (app) {

    //This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
    //each doing the same thing just structuring the functions/data differently.

    //Although this is a AngularJS factory, I prefer the term 'service' for data operations
    app.factory('customersBreezeService', function () {
        var customersFactory = {};

        // configure to use the model library for Angular
        breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore', true);
        // configure to use camelCase
        breeze.NamingConvention.camelCase.setAsDefault();
        // create entity manager
        var manager = new breeze.EntityManager('breeze/breezedataservice');

        customersFactory.getCustomers = function () {
            var query = breeze.EntityQuery.from('Customers').expand('orders');
            return manager.executeQuery(query).then(function (data) {
                return data.results;
            });
        };

        customersFactory.getCustomersSummary = function () {
            var query = breeze.EntityQuery.from('CustomersSummary');
            return manager.executeQuery(query).then(function (data) {
                return data.results;
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

        customersFactory.deleteCustomer = function (id) {
            for (var i = customers.length - 1; i >= 0; i--) {
                if (customers[i].id === id) {
                    customers.splice(i, 1);
                    break;
                }
            }
        };

        customersFactory.getCustomer = function (id) {
            var query = breeze.EntityQuery
                .from('Customers')
                .where('id', 'eq', id)
                .expand('orders');
            return manager.executeQuery(query).then(function (data) {
                return data.results[0];
            });
        };

        //Must call $scope.$apply() for this one after async since third party is being used
        customersFactory.apply = function (scope) {
            scope.$apply();
        };

        var OrderCtor = function () { }
        OrderCtor.prototype.orderTotal = function () {
            return this.quantity * this.price;
        };

        var CustomerCtor = function () { }
        CustomerCtor.prototype.ordersTotal = function () {
            var total = 0;
            var orders = this.orders;
            var count = orders.length;
            for (var i = 0; i < count; i++) {
                total += orders[i].orderTotal();
            }
            return total;

        };

        manager.metadataStore.registerEntityTypeCtor('Order', OrderCtor);
        manager.metadataStore.registerEntityTypeCtor('Customer', CustomerCtor);

        return customersFactory;

    });

});