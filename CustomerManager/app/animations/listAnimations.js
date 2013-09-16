define([], function () {
    var app = angular.module('wc.Animations', [])
    app.animation('.card-animation', function () {
          var duration = 0.5;
          return {
              enter: function (element, done) {
                  var random = Math.random() * 100;
                  TweenMax.set(element, { opacity: 0, left: random + 'px' });

                  var random2 = Math.random();
                  TweenMax.to(element, duration, { opacity: 1, left: '0px', ease: Back.easeInOut, delay: random2, onComplete: done });
              },
              leave: function (element, done) {
                  TweenMax.to(element, duration, { opacity: 0, left: '-50px', onComplete: done });
              }
          };
      });
});