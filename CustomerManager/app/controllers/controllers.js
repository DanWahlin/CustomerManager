//This controller retrieves data from the customersService and associates it with the $scope
//The $scope is ultimately bound to the customers view
app.controller('CustomersController', ['$scope', 'config', 'dataService', function ($scope, config, dataService) {
    
    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
    //one place...not required though especially in the simple example below
    init();

    function init() {
        dataService.getCustomersSummary()
            .then(function (customers) {
                $scope.customers = customers;
                dataService.apply($scope); //Handles calling $apply() if needed
            }, function (error) {
                alert(error.message);
            });
    }

    $scope.insertCustomer = function () {
        var firstName = $scope.newCustomer.firstName;
        var lastName = $scope.newCustomer.lastName;
        var city = $scope.newCustomer.city;
        dataService.insertCustomer(firstName, lastName, city);
        $scope.newCustomer.firstName = '';
        $scope.newCustomer.lastName = '';
        $scope.newCustomer.city = '';
    };

    $scope.deleteCustomer = function (id) {
        dataService.deleteCustomer(id);
    };
}]);

//This controller retrieves data from the customersService and associates it with the $scope
//The $scope is bound to the order view
app.controller('CustomerOrdersController', ['$scope', '$routeParams', 'dataService', function ($scope, $routeParams, dataService) {
    $scope.customer = {};
    $scope.ordersTotal = 0.00;

    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
    //one place...not required though especially in the simple example below
    init();

    function init() {
        //Grab customerID off of the route        
        var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;
        if (customerID > 0) {
            dataService.getCustomer(customerID)
            .then(function (customer) {
                $scope.customer = customer;
                dataService.apply($scope);
            }, function (error) {
                alert(error.message);
            });
        }
    }

}]);

//This controller retrieves data from the customersService and associates it with the $scope
//The $scope is bound to the orders view
app.controller('OrdersController', ['$scope', 'dataService', function ($scope, dataService) {
    $scope.customers = [];
    

    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
    //one place...not required though especially in the simple example below
    init();

    function init() {
        dataService.getCustomers()
            .then(function (customers) {
                $scope.customers = customers;
                dataService.apply($scope);
            }, function (error) {
                alert(error.message);
            });
    }
}]);

app.controller('NavbarController', ['$scope', '$location', 'config', function ($scope, $location, config) {

    $scope.appTitle = config.appTitle + (config.useBreeze ? ' with Breeze' : '');

    $scope.getClass = function (path) {
        if ($location.path().substr(0, path.length) == path) {
            return true
        } else {
            return false;
        }
    }
}]);

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
        if (orderby === $scope.orderby)
        {
            $scope.reverse = !$scope.reverse;
        }
        $scope.orderby = orderby;
    };

}]);
