'use strict';

angular.module('BigScreen.Portal')

.controller('ParkingAreaController', ['$scope', '$timeout', 'ParkingChart', function($scope, $timeout, ParkingChart) {

    var myChart;
    $scope.init = function() {
        ParkingChart.init(document.getElementById('parking-chart'));
        ParkingChart.setData();
    }

    $scope.$on('theHour', function() {
        console.log('theHour');
        ParkingChart.setData();;
    })
}]);