'use strict';

define(['app', 'services/customersBreezeService', 'services/customersService'], function (app) {

    app.factory('dataService', function (config, customersService, customersBreezeService) {
        return (config.useBreeze) ? customersBreezeService : customersService;
    });

});

