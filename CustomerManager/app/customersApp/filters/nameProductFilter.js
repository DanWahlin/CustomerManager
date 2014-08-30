'use strict';

define(['app'], function (app) {

    var nameProductFilter = function () {

        function matchesProduct(customer, filterValue) {
            if (customer.orders) {
                for (var i = 0; i < customer.orders.length; i++) {
                    if (customer.orders[i].product.toLowerCase().indexOf(filterValue) > -1) {
                        return true;
                    }
                }
            }
            return false;
        }

        return function (customers, filterValue) {
            if (!filterValue || !customers) return customers;

            var matches = [];
            filterValue = filterValue.toLowerCase();
            for (var i = 0; i < customers.length; i++) {
                var cust = customers[i];
                if (cust.firstName.toLowerCase().indexOf(filterValue) > -1 ||
                    cust.lastName.toLowerCase().indexOf(filterValue) > -1 ||
                    matchesProduct(cust, filterValue)) {

                    matches.push(cust);
                }
            }
            return matches;
        };
    };

    app.filter('nameProductFilter', nameProductFilter);

});