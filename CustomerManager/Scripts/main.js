require.config({
    baseUrl: '/app',
    urlArgs: 'v=1.0'
});

require(
    [
        'animations/listAnimations',
        'app',
        'services/routeResolver',
        'services/config',
        'services/customersBreezeService',
        'services/customersService',
        'services/dataService',
        'services/dialogService',
        'controllers/navbarController',
        'controllers/orders/orderChildController'
    ],
    function () {
        angular.bootstrap(document, ['customersApp']);
    });
