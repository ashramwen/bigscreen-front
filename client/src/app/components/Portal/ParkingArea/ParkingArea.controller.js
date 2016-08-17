'use strict';

angular.module('BigScreen.Portal')

.controller('ParkingAreaController', ['$scope', 'ParkingService', function($scope, ParkingService) {

    var today = new Date();
    ParkingService.getCarInFrequency({
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0, 0, 0).getTime(),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0, 0, 0).getTime(),
        interval: '1h'
    });

    ParkingService.getCarOutFrequency({
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0, 0, 0).getTime(),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0, 0, 0).getTime(),
        interval: '1h'
    });

    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['进入高峰', '驶出高峰'],
            // textStyle: {
            //     fontSize: 24
            // }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1', '2', '3', '4', '5', '6', '7']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: '进入高峰',
            type: 'line',
            data: [11, 11, 15, 1, 12, 13, 10],
            smooth: true,
            areaStyle: {
                normal: {
                    color: 'rgba(133, 165, 184, 0.5)'
                }
            },
            markPoint: {
                data: [{
                    type: 'max',
                    name: '最大值',
                    // symbolSize: 60,
                    // label: {
                    //     normal: {
                    //         textStyle: {
                    //             fontSize: 24
                    //         }
                    //     }
                    // }
                }]
            }
        }, {
            name: '驶出高峰',
            type: 'line',
            data: [1, 1, 2, 5, 3, 2, 0],
            smooth: true,
            areaStyle: {
                normal: {
                    color: 'rgba(62, 197, 235, 0.5)'
                }
            },
            markPoint: {
                data: [{
                    type: 'max',
                    name: '最大值',
                    // symbolSize: 60,
                    // label: {
                    //     normal: {
                    //         textStyle: {
                    //             fontSize: 24
                    //         }
                    //     }
                    // }
                }]
            },
        }]
    };


    $scope.init = function() {
        var myChart = echarts.init(document.getElementById('parking-chart'));
        myChart.setOption(option);
    }
}]);