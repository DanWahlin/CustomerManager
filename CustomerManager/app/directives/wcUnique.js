'use strict';

define(['app'], function (app) {

    app.directive('wcUnique', ['dataService', function (dataService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                element.bind('blur', function (e) {
                    if (!element.val()) return;
                    var keyProperty = scope.$eval(attrs.wcUnique);
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