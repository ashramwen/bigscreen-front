'use strict';

angular.module('BigScreen.Portal')

.controller('ParkingAreaController', ['$scope', function($scope, mqttClient, sendHttpRequest) {

    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['进入高峰', '驶出高峰']
        },
        toolbox: {
            show: true,
            feature: {
                magicType: { type: ['line', 'bar'] }
            }
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
                data: [
                    { type: 'max', name: '最大值' }
                ]
            },
            // markLine: {
            //     data: [
            //         { type: 'average', name: '平均值' }
            //     ]
            // }
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
                data: [
                    { type: 'max', name: '最大值' }
                ]
            },
            // markLine: {
            //     data: [
            //         { type: 'average', name: '平均值' },
            //         [{
            //             symbol: 'none',
            //             x: '90%',
            //             yAxis: 'max'
            //         }, {
            //             symbol: 'circle',
            //             label: {
            //                 normal: {
            //                     position: 'start',
            //                     formatter: '最大值'
            //                 }
            //             },
            //             type: 'max',
            //             name: '最高点'
            //         }]
            //     ]
            // }
        }]
    };


    $scope.init = function() {
        var myChart = echarts.init(document.getElementById('parking-chart'));
        myChart.setOption(option);
    }
}]);