define([], function () {
    angular.module('CustomAnimations', [])
      .animation('.card-animation', function () {
          return {
              enter: function (element, done) {
                  var duration = 1;
                  var random = Math.random() * 200;
                  TweenMax.set(element, { opacity: 0, left: random + 'px' });

                  var random2 = Math.random();
                  TweenMax.to(element, duration, { opacity: 1, left: '0px', ease: Back.easeInOut, delay: random2, onComplete: done });
              },
              leave: function (element, done) {
                  var duration = 1;
                  TweenMax.to(element, 1, { opacity: 0, left: '-100px', onComplete: done });
              }
          };
      });
});