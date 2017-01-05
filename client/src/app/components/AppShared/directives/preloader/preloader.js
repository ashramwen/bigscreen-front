angular.module('BigScreen.AppShared')

.directive('preloader', function () {
    return {
        restrict: 'EA',
        templateUrl: 'app/components/AppShared/directives/preloader/preloader.html',
        // replace: true
    }
});