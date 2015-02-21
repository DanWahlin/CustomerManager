/*
    Thanks to Karl-Gustav for creating the autoActive directive 
    to simplify highlighting <li> elements in a menu based on the path
    View the original version of the autoActive directive at 
    https://github.com/Karl-Gustav/autoActive

    This version renames the directive and does some minor code restructuring and changes.
*/

(function () {

    var injectParams = ['$location'];

    var menuHighlighter = function ($location) {

        var link = function (scope, element) {
            function setActive() {
                var path = $location.path();
                var className = scope.highlightClassName || 'active';

                if (path) {
                    angular.forEach(element.find('li'), function (li) {
                        var anchor = li.querySelector('a');
                        //Get href from href attribute or data-href in cases where href isn't used (such as login)
                        var href = (anchor && anchor.href) ? anchor.href :
                                                             anchor.getAttribute('data-href').replace('#', '');
                        //Get value after hash
                        var trimmedHref = href.substr(href.indexOf('#/') + 1, href.length);
                        //Convert path to same length as trimmedHref
                        var basePath = path.substr(0, trimmedHref.length);

                        //See if trimmedHref and basePath match. If so, then highlight that item
                        if (trimmedHref === basePath) {
                            angular.element(li).addClass(className);
                        } else {
                            angular.element(li).removeClass(className);
                        }
                    });
                }
            }

            setActive();

            //Monitor location changes
            scope.$on('$locationChangeSuccess', setActive);
        };

        return {
            restrict: 'A',
            scope: {
                highlightClassName: '@'
            },
            link: link
        }
    }

    menuHighlighter.$inject = injectParams;

    angular.module('wc.directives').directive('menuHighlighter', menuHighlighter);

}());