'use strict';

angular.module('BigScreen.Portal')

.controller('ParkingAreaController', ['$scope', '$timeout', 'ParkingService', 'ParkingChart', function($scope, $timeout, ParkingService, ParkingChart) {

    $scope.init = function() {
        ParkingChart.init(document.getElementById('parking-chart'));
        ParkingChart.setData();

        ParkingService.leaveAvgTime().$promise.then(function(res) {
            $scope.leaveTime = moment.duration(res.time).asMinutes().toFixed(0);
        });
    }

    $scope.$on('theHour', function() {
        ParkingChart.setData();;
    })
}]);