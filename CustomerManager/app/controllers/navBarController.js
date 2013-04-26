app.controller('NavbarController', ['$scope', '$location', 'config', function ($scope, $location, config) {

    $scope.appTitle = config.appTitle + (config.useBreeze ? ' with Breeze' : '');

    $scope.getClass = function (path) {
        if ($location.path().substr(0, path.length) == path) {
            return true
        } else {
            return false;
        }
    }
}]);