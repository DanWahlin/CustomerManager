'use strict';

define(['app', 'customersApp/services/customersBreezeService',
        'customersApp/services/customersService'], function (app) {

    var injectParams = ['config', 'customersService', 'customersBreezeService'];

    var dataService = function (config, customersService, customersBreezeService) {
        return (config.useBreeze) ? customersBreezeService : customersService;
    };

    dataService.$inject = injectParams;

    app.factory('dataService',
        ['config', 'customersService', 'customersBreezeService', dataService]);

});

