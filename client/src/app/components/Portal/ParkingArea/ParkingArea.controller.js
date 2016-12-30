'use strict';

angular.module('BigScreen.Portal')

    .controller('ParkingAreaController', ['$scope', '$timeout', 'ParkingAreaService', 'ParkingChart', function ($scope, $timeout, ParkingAreaService, ParkingChart) {

        $scope.init = function () {
            ParkingChart.init(document.getElementById('parking-chart'));
            ParkingChart.setData();

            ParkingAreaService.leaveAvgTime().then(function (res) {
                if (res.time < 0)
                    $scope.leaveTime = 0;
                else
                    $scope.leaveTime = moment.duration(res.time).asMinutes().toFixed(0);
            });
        }

        $scope.$on('theHour', function () {
            ParkingChart.setData();;
        })
    }]);