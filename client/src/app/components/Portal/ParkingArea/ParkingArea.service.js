// ParkingArea
'use strict';

angular.module('BigScreen.Portal')

.factory('ParkingService', ['$resource', '$q', function($resource, $q) {
    var _today = new Date();
    var today = {
        year: _today.getFullYear(),
        month: _today.getMonth(),
        day: _today.getDate()
    }
    var Parking = $resource(thirdPartyAPIUrl, {
        startTime: new Date(today.year, today.month, today.day, 8, 0, 0, 0).getTime(),
        endTime: new Date(today.year, today.month, today.day, 20, 0, 0, 0).getTime(),
        interval: '1h'
    }, {
        getCarInFrequency: {
            url: thirdPartyAPIUrl + 'carparking/CarInFrequency',
            method: 'GET',
            headers: { 'apiKey': thirdPartyAPIKey }
        },
        getCarOutFrequency: {
            url: thirdPartyAPIUrl + 'carparking/CarOutFrequency',
            method: 'GET',
            headers: { 'apiKey': thirdPartyAPIKey }
        }
    });

    var qIn = Parking.getCarInFrequency;
    var qOut = Parking.getCarOutFrequency;

    return function() {
        var deferred = $q.defer();
        $q.all([qIn().$promise, qOut().$promise]).then(function(res) {
            var ret = [res[0].aggregations.byHour.buckets, res[1].aggregations.byHour.buckets];
            deferred.resolve(ret);
        }, function() {
            deferred.reject();
        });
        return deferred.promise;
    };
}])

.factory('ParkingChart', ['$rootScope', 'ParkingService', function($rootScope, ParkingService) {
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['进入高峰', '驶出高峰'],
            textStyle: {
                fontSize: 24
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel: {
                formatter: function(value, index) {
                    return moment(value).format('H:mm');
                }
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: '进入高峰',
            type: 'line',
            // data: [11, 11, 15, 1, 12, 13, 10],
            smooth: true,
            areaStyle: {
                normal: {
                    // color: 'rgba(133, 165, 184, 0.5)'
                    color: '#89a8b9'
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
            // data: [1, 1, 2, 5, 3, 2, 0],
            smooth: true,
            areaStyle: {
                normal: {
                    // color: 'rgba(62, 197, 235, 0.5)'
                    color: '#2ec3ed'
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

    function parseData(resIn, resOut) {
        var x = [],
            dataIn = [],
            dataOut = [];
        var i = 0;
        var length = (resIn.length > resOut.length) ? resIn.length : resOut.length;
        for (; i < length; i++) {
            if (resIn[i]) {
                x[i] = resIn[i].key;
                dataIn.push(resIn[i].doc_count);
            }
            if (resOut[i]) {
                x[i] = resOut[i].key;
                dataOut.push(resOut[i].doc_count);
            }
        }
        return {
            x: x,
            dataIn: dataIn,
            dataOut: dataOut
        }
    }

    var myChart;
    var ParkingChart = {
        init: function(elem) {
            myChart = echarts.init(elem);
            myChart.setOption(option);
        },
        setData: function() {
            ParkingService().then(function(res) {
                var data = parseData(res[0], res[1]);
                myChart.setOption({
                    xAxis: {
                        data: data.x
                    },
                    series: [{
                        name: '进入高峰',
                        data: data.dataIn
                    }, {
                        name: '驶出高峰',
                        data: data.dataOut
                    }]
                });
            });
        }
    };

    return ParkingChart;
}]);