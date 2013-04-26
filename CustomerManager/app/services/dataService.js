app.factory('dataService', function (config, customersService, customersBreezeService) {
    return (config.useBreeze) ? customersBreezeService : customersService;
});
