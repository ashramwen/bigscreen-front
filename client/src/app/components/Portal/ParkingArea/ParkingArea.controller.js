'use strict';

angular.module('BigScreen.Portal')

.controller('ParkingAreaController', ['$scope', '$timeout', 'ParkingChart', function($scope, $timeout, ParkingChart) {

    $scope.init = function() {
        ParkingChart.init(document.getElementById('parking-chart'));
        ParkingChart.setData();
    }

    $scope.$on('theHour', function() {
        ParkingChart.setData();;
    })
}]);