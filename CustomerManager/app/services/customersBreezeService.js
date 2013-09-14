'use strict';

define(['app'], function (app) {

    //Although this is a AngularJS factory, I prefer the term 'service' for data operations
    app.factory('customersBreezeService', function () {
        var customersFactory = {};
        var EntityQuery = breeze.EntityQuery;

        // configure to use the model library for Angular
        breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore', true);
        // configure to use camelCase
        breeze.NamingConvention.camelCase.setAsDefault();
        // create entity Manager
        var serviceName = 'breeze/breezedataservice';
        var entityManager = new breeze.EntityManager(serviceName);
       
        function executeQuery(query, takeFirst) {
            return query.using(entityManager).execute().to$q(querySuccess, queryError);

            function querySuccess(data) {
                return takeFirst ? data.results[0] : data.results;
            }

            function queryError(error) {
                alert(error.message);
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
                return Q(true);
            }
            else { //Get metadata
                return store.fetchMetadata(serviceName);
            }            
        }    

        customersFactory.getCustomers = function () {
            return getAll('Customers', 'orders');
        };

        customersFactory.getCustomersSummary = function () {
            return getAll('CustomersSummary');
        };

        customersFactory.getStates = function () {
            return getAll('States');
        };

        customersFactory.getCustomer = function (id) {
            var query = EntityQuery
                .from('Customers')
                .where('id', '==', id)
                .expand('Orders, State');
            return executeQuery(query, true);
        };

        customersFactory.checkUniqueValue = function (id, property, value) {
            var propertyPredicate = new breeze.Predicate(property, "==", value);
            var predicate = (id) ? propertyPredicate.and(new breeze.Predicate("id", "!=", id)) : propertyPredicate;

            var query = EntityQuery.from('Customers').where(predicate);

            return executeQuery(query);
        };

        customersFactory.insertCustomer = function (customer) {
            return entityManager.saveChanges().to$q();
        };

        customersFactory.newCustomer = function () {
            return getMetadata().to$q(function () {
                return entityManager.createEntity('Customer', { firstName: '', lastName: '' });
            });
        }

        customersFactory.deleteCustomer = function (id) {
            if (!id) {
                alert('ID was null - cannot delete');
                return;
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

            return entityManager.saveChanges().to$q();
        };

        customersFactory.updateCustomer = function (customer) {
            return entityManager.saveChanges().to$q();
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

        entityManager.metadataStore.registerEntityTypeCtor('Order', OrderCtor);
        entityManager.metadataStore.registerEntityTypeCtor('Customer', CustomerCtor);

        return customersFactory;

    });

});