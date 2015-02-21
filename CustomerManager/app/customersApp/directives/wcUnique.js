'use strict';

define(['app'], function (app) {

    var injectParams = ['$q', 'dataService'];

    var wcUniqueDirective = function ($q, dataService) {

        var link = function (scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.unique = function (modelValue, viewValue) {
                var deferred = $q.defer(),
                    currentValue = modelValue || viewValue,
                    key = attrs.wcUniqueKey,
                    property = attrs.wcUniqueProperty;

                //First time the asyncValidators function is loaded the
                //key won't be set  so ensure that we have 
                //key and propertyName before checking with the server 
                if (key && property) {
                    dataService.checkUniqueValue(key, property, currentValue)
                    .then(function (unique) {
                        if (unique) {
                            deferred.resolve(); //It's unique
                        }
                        else {
                            deferred.reject(); //Add unique to $errors
                        }
                    });
                    return deferred.promise;
                }
                else {
                    return $q.when(true);
                }
            };
        };

        return {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };
    };

    wcUniqueDirective.$inject = injectParams;

    app.directive('wcUnique', wcUniqueDirective);

});