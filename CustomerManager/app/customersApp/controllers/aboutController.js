'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope'];

    var AboutController = function ($scope) {

    };

    AboutController.$inject = injectParams;

    app.register.controller('AboutController', AboutController);

});