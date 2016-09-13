'use strict';

angular.module('BigScreen.Portal')

.controller('VIPController', ['$scope', '$state', '$stateParams', '$interval', 'GeofenceService', function($scope, $state, $stateParams, $interval, GeofenceService) {
    var index = $stateParams.id;

    var stop = $interval(function() {
        if (!GeofenceService.rotative) return;
        if (index === 3) {
            $state.go('^.OfficeSpace');
        } else {
            $state.go('.', { name: $stateParams.name, id: index + 1 });
        }
    }, 10000);

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options) {
        var a = 1;
    });

    $scope.$on('$destroy', function() {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    });
}]);