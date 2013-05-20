(function () {

    require.config({
        baseUrl: '/app',
        paths: {
            angular:                ['//ajax.googleapis.com/ajax/libs/angularjs/1.1.4/angular',
                                     '/scripts/angular-1.1.4']

        },
        shim: {
            angular: { exports: 'angular' }
        },
        urlArgs: 'v=1.0'
    });

    require(
        [
            'angular',
            'app',
            'services/routeResolver',
            'services/config',
            'services/customersBreezeService',
            'services/customersService',
            'services/dataService',
            'controllers/navbarController',
            'controllers/orderChildController'
        ],
        function (angular) {
            angular.bootstrap(document, ['customersApp']);
        });

})();

/*
    Bootstrap CDN info: http://www.bootstrapcdn.com
*/