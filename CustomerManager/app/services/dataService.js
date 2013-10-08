'use strict';

define(['app', 'services/customersBreezeService', 'services/customersService'], function (app) {

    var dataService = function (config, customersService, customersBreezeService) {
        return (config.useBreeze) ? customersBreezeService : customersService;
    };

    app.factory('dataService',
        ['config', 'customersService', 'customersBreezeService', dataService]);

});

