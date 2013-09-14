'use strict';

define(['app', 'services/customersBreezeService', 'services/customersService'], function (app) {

    app.factory('dataService', ['config', 'customersService', 'customersBreezeService',
        function (config, customersService, customersBreezeService) {
            return (config.useBreeze) ? customersBreezeService : customersService;
        }]);

});

