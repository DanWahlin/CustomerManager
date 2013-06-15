require.config({
    baseUrl: '/app',
    urlArgs: 'v=1.0'
});

require(
    [
        'app',
        'animations/listAnimations',
        'services/routeResolver',
        'services/config',
        'services/customersBreezeService',
        'services/customersService',
        'services/dataService',
        'controllers/navbarController',
        'controllers/orders/orderChildController'
    ],
    function () {
        angular.bootstrap(document, ['customersApp']);
    });
