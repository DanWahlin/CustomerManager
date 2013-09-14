/*
 * Monkey patch Q.js' promise prototype with `to$q()` method
 * which converts a Q.js promise into an angular.js $q promise

 *
 * Copyright 2013 IdeaBlade, Inc.  All Rights Reserved.  
 * Licensed under the MIT License
 * http://opensource.org/licenses/mit-license.php
 * Author: Ward Bell
 *
 * Install:
 *   1) include this script after breeze script
 *   2) before using in your module, call breeze.core.extendQ(), ex:
 *      breeze.core.extendQ($rootScope, $q);
 *
 * Use to$q:
 *   var promise = entityManager.executeQuery(query)

 *          // instead of using these Q promise callback methods ...
 *          //.then(successCallback).fail(failCallback); 

 *          // switch immediately to $q and 
 *          // (optionally) pass them directly to $q.then(...)
 *          // by way of to$q itself
 *          .to$q(successCallback, failCallback);
 *
 *   //... some time later, perhaps in a different module...
 *   //... chain on another $q.then()
 *   promise.then(anotherSuccess, anotherFail); 
 */
(function () {
    'use strict';

    breeze.core.extendQ = extendQ;

    // monkey patch to$q into Q.js' promise prototype
    function extendQ($rootScope, $q) {

        var promise = Q.defer().promise;
        var fn = Object.getPrototypeOf(promise);
        if (fn.to$q) return; // already extended
        fn.to$q = function (success, fail) { return to$q(this, success, fail); };

        /*********************************************************
        * @method to$q {Promise} Convert a Q.js promise into an angular $q
        * and optionally add a $q.then(sucess, fail) to the returned $q promise.
        * @param promiseQ {Promise} the Q.js promise to convert
        * The Q promise must return some value when they succeed or
        * rethrow the error if they fail. Else this method logs an error.
        * @param [success] {function} optional success callback for the $q.then()
        * @param [fail] {function} optional fail callback for the $q.then()
        *********************************************************/
        function to$q(qPromise, success, fail) {
            var d = $q.defer();
            qPromise
                .then(function (data) {
                    if (data === undefined) {
                        $log.error("Programming error: no data. " +
                        "Perhaps success callback didn't return a value or " +
                            "fail callback didn't re-throw error");
                        // If an error is caught and not rethrown in an earlier promise chain
                        // will arrive here with data === undefined. 
                        // Neglecting to re-throw is a common, accidental omission.
                        // To be safe, have every success callback return something
                        // and trap here if data is ever undefined
                    }
                    d.resolve(data);
                    $apply();// see https://groups.google.com/forum/#!topic/angular/LQoBCQ-V_tM
                })
                .fail(function (error) {
                    d.reject(error);
                    $apply();// see https://groups.google.com/forum/#!topic/angular/LQoBCQ-V_tM
                });
            if (success || fail) {
                d.promise = d.promise.then(success, fail);
            }
            return d.promise;
        }

        /*********************************************************
        * @method $apply {Void} easy access to $rootScope.$apply
        * @param [func]{function} optional string or niladic function to call
        *********************************************************/
        function $apply(expression) {
            if ($rootScope.$$phase) {
                // from $apply pseudo-code in http://docs.angularjs.org/api/ng.$rootScope.Scope
                if (expression) {
                    try {
                        $rootScope.$eval(arguments);
                    } catch (e) {
                        logger.error(e);
                    }
                }
            } else {
                $rootScope.$apply.apply($rootScope, arguments);
            }
        }
    }
})();