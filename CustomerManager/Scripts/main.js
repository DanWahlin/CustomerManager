require.config({
    baseUrl: 'app',
    urlArgs: 'v=1.0'
});

require(
    [
        'customersApp/animations/listAnimations',
        'app',
        'customersApp/directives/wcUnique',
        'customersApp/services/routeResolver',
        'customersApp/services/config',
        'customersApp/services/customersBreezeService',
        'customersApp/services/authService',
        'customersApp/services/customersService',
        'customersApp/services/dataService',
        'customersApp/services/modalService',
        'customersApp/services/httpInterceptors',
        'customersApp/filters/nameCityStateFilter',
        'customersApp/filters/nameProductFilter',
        'customersApp/controllers/navbarController',
        'customersApp/controllers/orders/orderChildController',
    ],
    function () {
        angular.bootstrap(document, ['customersApp']);
    });
