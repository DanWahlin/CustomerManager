'use strict';

define(['app'], function (app) {

    app.directive('unique', ['dataService', function (dataService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                element.bind('blur', function (e) {
                    if (element.val()) return;
                    var keyProperty = scope.$eval(attrs.unique);
                    dataService.checkUniqueValue(keyProperty.key, keyProperty.property, element.val())
                        .then(function (unique) {
                            ngModel.$setValidity('unique',  unique);
                        }, function () {
                            ngModel.$setValidity('unique', true);
                        });
                });
            }
        }
    }]);

});