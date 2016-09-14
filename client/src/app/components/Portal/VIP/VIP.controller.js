'use strict';

angular.module('BigScreen.Portal')

.controller('VIPController', ['$scope', '$state', '$stateParams', '$interval', 'GeofenceService', function($scope, $state, $stateParams, $interval, GeofenceService) {
    var index = $stateParams.id;
    var vip = GeofenceService.vip;
    var stop = $interval(function() {
        if (!GeofenceService.rotative) return;
        if (index === vip.pics.length) {
            $state.go('^.OfficeSpace');
        } else {
            $state.go('.', { name: $stateParams.name, id: index + 1 });
        }
    }, 10000);

    $scope.pic = vip.pics[index - 1];

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options) {
        $scope.$parent.portalTitle = $scope.pic.text;
    });

    $scope.$on('$destroy', function() {
        if (!angular.isDefined(stop)) return;
        $interval.cancel(stop);
        stop = undefined;
    });
}]);