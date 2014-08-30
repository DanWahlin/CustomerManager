'use strict';

define(['app', 'customersApp/services/customersBreezeService',
        'customersApp/services/customersService'], function (app) {

    var dataService = function (config, customersService, customersBreezeService) {
        return (config.useBreeze) ? customersBreezeService : customersService;
    };

    dataService.$inject = ['config', 'customersService', 'customersBreezeService'];

    app.factory('dataService',
        ['config', 'customersService', 'customersBreezeService', dataService]);

});

