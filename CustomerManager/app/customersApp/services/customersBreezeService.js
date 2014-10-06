'use strict';

define(['app'], function (app) {

    var injectParams = ['breeze', '$q', '$window'];

    var customersBreezeService = function (breeze, $q, $window) {

        var factory = {};
        var EntityQuery = breeze.EntityQuery;

        // configure to use the model library for Angular
        breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore', true);
        // configure to use camelCase
        breeze.NamingConvention.camelCase.setAsDefault();
        // create entity Manager
        var serviceName = 'breeze/breezedataservice';
        var entityManager = new breeze.EntityManager(serviceName);

        factory.getCustomers = function (pageIndex, pageSize) {
            return getPagedResource('Customers', 'orders', pageIndex, pageSize);
        };

        factory.getCustomersSummary = function (pageIndex, pageSize) {
            return getPagedResource('CustomersSummary', '', pageIndex, pageSize);
        };

        factory.getStates = function () {
            return getAll('States');
        };

        factory.getCustomer = function (id) {
            var query = EntityQuery
                .from('Customers')
                .where('id', '==', id)
                .expand('Orders, State');
            return executeQuery(query, true);
        };

        factory.checkUniqueValue = function (id, property, value) {
            var propertyPredicate = new breeze.Predicate(property, "==", value);
            var predicate = (id) ? propertyPredicate.and(new breeze.Predicate("id", "!=", id)) : propertyPredicate;

            var query = EntityQuery.from('Customers').where(predicate).take(0).inlineCount();

            return query.using(entityManager).execute().then(function (data) {
                return (data && data.inlineCount == 0) ? true : false;
            });
        };

        factory.insertCustomer = function (customer) {
            return entityManager.saveChanges();
        };

        factory.newCustomer = function () {
            return getMetadata().then(function () {
                return entityManager.createEntity('Customer', { firstName: '', lastName: '' });
            });
        };

        factory.deleteCustomer = function (id) {
            if (!id) {
                $window.alert('ID was null - cannot delete');
                return null;
            }
            var customer = entityManager.getEntityByKey('Customer', id);

            /*  When the customer is deleted the customerID is set to 0 for each order
                since no parent exists
                Detach orders since the customer is being deleted and server
                is set to cascade deletes
            */
            if (customer) {
                var orders = customer.orders.slice(); //Create a copy of the live list
                orders.forEach(function (order) {
                    entityManager.detachEntity(order);
                });
                customer.entityAspect.setDeleted();
            }
            else {
                //Really a CustomerSummary so we're going to add a new Customer 
                //and mark it as deleted. That allows us to save some code and avoid having
                //a separate method to deal with the CustomerSummary projection
                customer = entityManager.createEntity('Customer', { id: id, gender: 'Male' }, breeze.EntityState.Deleted);
            }

            return entityManager.saveChanges();
        };

        factory.updateCustomer = function (customer) {
            return entityManager.saveChanges();
        };

        function executeQuery(query, takeFirst) {
            return query.using(entityManager).execute().then(querySuccess, queryError);

            function querySuccess(data, status, headers) {
                return takeFirst ? data.results[0] : data.results;
            }

            function queryError(error) {
                $window.alert(error.message);
            }
        }

        function getAll(entityName, expand) {
            var query = EntityQuery.from(entityName);
            if (expand) {
                query = query.expand(expand);
            }
            return executeQuery(query);
        }

        function getMetadata() {
            var store = entityManager.metadataStore;
            if (store.hasMetadataFor(serviceName)) { //Have metadata
                return $q.when(true);
            }
            else { //Get metadata
                return store.fetchMetadata(serviceName);
            }
        }

        function getPagedResource(entityName, expand, pageIndex, pageSize) {
            var query = EntityQuery
            .from(entityName)
            .skip(pageIndex * pageSize)
            .take(pageSize)
            .inlineCount(true);

            if (expand && expand != '') {
                query = query.expand(expand);
            }

            //Not calling the re-useable executeQuery() function here since we need to get to more details
            //and return a custom object
            return query.using(entityManager).execute().then(function (data) {
                return {
                    totalRecords: parseInt(data.inlineCount),
                    results: data.results
                };
            }, function (error) {
                $window.alert('Error ' + error.message);
            });
        }

        var OrderCtor = function () {

        };

        function orderInit(order) {
            order.orderTotal = order.quantity * order.price;
        }

        var CustomerCtor = function () {

        };

        function customerInit(customer) {
            customer.ordersTotal = ordersTotal(customer);
        }

        function ordersTotal(customer) {
            var total = 0;
            var orders = customer.orders;
            var count = orders.length;

            for (var i = 0; i < count; i++) {
                total += orders[i].orderTotal;
            }
            return total;
        };

        entityManager.metadataStore.registerEntityTypeCtor('Order', OrderCtor, orderInit);
        entityManager.metadataStore.registerEntityTypeCtor('Customer', CustomerCtor, customerInit);

        return factory;
    };

    customersBreezeService.$inject = injectParams;

    app.factory('customersBreezeService', customersBreezeService);

});