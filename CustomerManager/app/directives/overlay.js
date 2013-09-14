'use strict';

define([], function () {

    var app = angular.module('wc.Directives', []);
    app.factory('httpInterceptor', function ($q) {
        return {
            request: function (config) { },
            response: function (response) { },
            responseError: function (rejection) { },
        }
    });

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    });
    
    
    app.directive('overlay', ['$q', '$timeout', '$window', 'httpInterceptor', function ($q, $timeout, $window, httpInterceptor) {
        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                overlayDelay: "@"
            },
            template: '<div id="overlay-container" class="overlayContainer">' + 
                          '<div id="overlay-background" class="overlayBackground"></div>' +
                          '<div id="overlay-content" class="overlayContent" data-ng-transclude>' +
                          '</div>' + 
                      '</div>',
            link: function (scope, element, attrs) {

                var overlayContainer = document.getElementById('overlay-container');
                var timerPromise = null;
                var inRequest = false;

                //Hook into httpInterceptor factory request/response/responseError functions
                httpInterceptor.request = function (config) {
                    inRequest = true;
                    timerPromise = $timeout(function () {
                        if (inRequest) showOverlay();
                    }, scope.overlayDelay ? scope.overlayDelay : 500); //Delay showing for 500 millis to avoid flicker

                    return config || $q.when(config);
                };

                httpInterceptor.response = function (response) {
                    inRequest = false;
                    hideOverlay();
                    return response || $q.when(response);
                };

                httpInterceptor.responseError = function (rejection) {
                    inRequest = false;
                    hideOverlay();
                    return rejection || $q.when(rejection);
                };

                function showOverlay() {
                    var w = 0;
                    var h = 0;
                    if (!$window.innerWidth) {
                        if (!(document.documentElement.clientWidth == 0)) {
                            w = document.documentElement.clientWidth;
                            h = document.documentElement.clientHeight;
                        }
                        else {
                            w = document.body.clientWidth;
                            h = document.body.clientHeight;
                        }
                    }
                    else {
                        w = $window.innerWidth;
                        h = $window.innerHeight;
                    }
                    var content = document.getElementById('overlay-content');
                    var contentWidth = parseInt(getComputedStyle(content, 'width').replace('px', ''));
                    var contentHeight = parseInt(getComputedStyle(content, 'height').replace('px', ''));

                    content.style.top = h / 2 - contentHeight / 2 + 'px';
                    content.style.left = w / 2 - contentWidth / 2 + 'px'

                    overlayContainer.style.display = 'block';
                }

                function hideOverlay() {
                    if (timerPromise) $timeout.cancel(timerPromise);
                    overlayContainer.style.display = 'none';
                }

                var getComputedStyle = function () {
                    var func = null;
                    if (document.defaultView && document.defaultView.getComputedStyle) {
                        func = document.defaultView.getComputedStyle;
                    } else if (typeof (document.body.currentStyle) !== "undefined") {
                        func = function (element, anything) {
                            return element["currentStyle"];
                        };
                    }

                    return function (element, style) {
                        return func(element, null)[style];
                    }
                }();
            }
        }
    }]);

});