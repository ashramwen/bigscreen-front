angular.module('BigScreen.AppShared')

.directive('smileyFace', function () {
    return {
        restrict: 'EA',
        templateUrl: 'app/components/AppShared/directives/smiley-face/smiley-face.html',
        replace: true,
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attrs) {}
    }
});