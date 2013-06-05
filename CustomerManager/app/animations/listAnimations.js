define([], function () {
    angular.module('CustomAnimations', [])
      .animation('list-enter', ['$window', function ($window) {
          return {
              setup: function (element) {
                  var random = Math.random() * 200;
                  TweenMax.set(element, { opacity: 0, left: random + 'px' });
              },
              start: function (element, done) {
                  var duration = 1;
                  var random = Math.random();
                  TweenMax.to(element, duration, { opacity: 1, left: '0px', ease: Back.easeInOut, delay: random, onComplete: done });
              }
          }
      }])

      .animation('list-leave', ['$window', function ($window) {
          return {
              start: function (element, done) {
                  var duration = 1;
                  TweenMax.to(element, 1, { opacity: 0, left: '-100px', onComplete: done });
              }
          }
      }])

});