/*
 * Breeze Angular Q.js substitution
 *
 * v.1.0.0
 *
 * Tell breeze to use $q for its promises rather than Q.js
 * You'll no longer need the Q.js library
 *
 * Copyright 2013 IdeaBlade, Inc.  All Rights Reserved.  
 * Licensed under the MIT License
 * http://opensource.org/licenses/mit-license.php
 * Author: Ward Bell
 *
 * Install:
 *   1) load this script after the breeze script
 *   2) make your app module depend upon the 'breeze.angular.q' module
 *   3) before calling any breeze async function, call use$q($q)
 *
 * ex:
 *   var app = angular.module('app', [
 *       // ... other dependencies ...
 *       'breeze.angular.q' // tells breeze to use $q instead of Q.js
 *   ]);
 *   
 *   app.run(['$q','use$q', function ($q, use$q) {
 *           use$q($q);
 *   }]);
 *
 */
(function () {
    'use strict';
    angular.module('breeze.angular.q', []).value('use$q', use$q);

    function use$q($q) {

        if (breeze.config.setQ) {
            breeze.config.setQ($q);
            $q.resolve = $q.when;  // add methods Breeze wants that $q lacks          
            extendBreezeWith_to$q(); // legacy
        } else {
            throw new Error(
                'Cannot use this version of use$q with breeze.version=' + breeze.version);
        }
    }


    // Legacy. Support apps that followed old recommendation of adding to$q
    // to the end of Breeze methods that returned Q.js promises.
    // Althought harmless, we don't need or want it with this module. 
    // But it may take time to remove to$q from an existing app
    // TODO: Deprecate as soon as we can. 
    function extendBreezeWith_to$q() {

        // EntityManager
        var proto = breeze.EntityManager.prototype;
        var executeQuery = proto.executeQuery;

        if (-1 < executeQuery.toString().indexOf('extendWith_to$q')) {
            return; // already extended Breeze
        }

        proto.executeQuery =
            function () {
                var promise = executeQuery.apply(this, arguments);
                return extendWith_to$q(promise);
            };

        var e_fetchMetadata = proto.fetchMetadata;
        proto.fetchMetadata =
            function () {
                var promise = e_fetchMetadata.apply(this, arguments);
                return extendWith_to$q(promise);
            };

        var fetchEntityByKey = proto.fetchEntityByKey;
        proto.fetchEntityByKey =
            function () {
                var promise = fetchEntityByKey.apply(this, arguments);
                return extendWith_to$q(promise);
            };

        var saveChanges = proto.saveChanges;
        proto.saveChanges =
            function () {
                var promise = saveChanges.apply(this, arguments);
                return extendWith_to$q(promise);
            };

        // MetadataStore
        proto = breeze.MetadataStore.prototype;
        var m_fetchMetadata = proto.fetchMetadata;
        proto.fetchMetadata =
            function () {
                var promise = m_fetchMetadata.apply(this, arguments);
                return extendWith_to$q(promise);
            };

        function extendWith_to$q(promise) {
            /*********************************************************
            * @method to$q {Promise} Convert a Q.js promise into an angular $q
            * and optionally add a $q.then(sucess, fail) to the returned $q promise.
            * @param promiseQ {Promise} the Q.js promise to convert
            * The Q promise must return some value when they succeed or
            * rethrow the error if they fail. Else this method logs an error.
            * @param [success] {function} optional success callback for the $q.then()
            * @param [fail] {function} optional fail callback for the $q.then()
            *********************************************************/
            promise.to$q = function (success, fail) {
                return (success || fail) ? promise.then(success, fail) : promise;
            };
            return promise;
        }
    }

})();