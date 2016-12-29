// ParkingArea
'use strict';

angular.module('BigScreen.Portal')

.factory('ParkingService', ['SessionService', '$resource', '$q', function (SessionService, $resource, $q) {
    var _user = SessionService.getPortalAdmin();
    var Parking = $resource(thirdPartyAPIUrl, {}, {
        getCarInFrequency: {
            url: thirdPartyAPIUrl + 'dataUtilization/CarInFrequency',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + _user.accessToken,
                'apiKey': thirdPartyAPIKey
            },
            params: {
                startTime: '@startTime',
                endTime: '@endTime',
                interval: '1h'
            }
        },
        getCarOutFrequency: {
            url: thirdPartyAPIUrl + 'dataUtilization/CarOutFrequency',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + _user.accessToken,
                'apiKey': thirdPartyAPIKey
            },
            params: {
                startTime: '@startTime',
                endTime: '@endTime',
                interval: '1h'
            }
        },
        leaveAvgTime: {
            url: thirdPartyAPIUrl + 'dataUtilization/leaveAvgTime',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + _user.accessToken,
                'apiKey': thirdPartyAPIKey
            },
            transformResponse: function (data) {
                return {
                    time: angular.fromJson(data)
                }
            }
        }
    });

    var qIn = Parking.getCarInFrequency;
    var qOut = Parking.getCarOutFrequency;

    return {
        getCarInOut: function () {
            var time = {
                startTime: moment().startOf('hour').hour(8).valueOf(),
                endTime: moment().startOf('hour').hour(20).valueOf()
            };

            var deferred = $q.defer();
            $q.all([qIn(time).$promise, qOut(time).$promise]).then(function (res) {
                var ret = [res[0].aggregations.byHour.buckets, res[1].aggregations.byHour.buckets];
                deferred.resolve(ret);
            }, function () {
                deferred.reject();
            });
            return deferred.promise;
        },
        leaveAvgTime: function () {
            return Parking.leaveAvgTime({}, {
                startTime: moment().subtract(1, 'days').startOf('day').valueOf(),
                endTime: moment().valueOf(),
            });
        }
    }
}])

.factory('ParkingChart', ['$rootScope', 'ParkingService', function ($rootScope, ParkingService) {
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
            // axisLabel: {
            //     formatter: function(value, index) {
            //         return moment(value).format('H:mm');
            //     }
            // }
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: '进入高峰',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    opacity: 0
                }
            },
            lineStyle: {
                normal: {
                    color: '#ff6600',
                    opacity: 0
                }
            },
            areaStyle: {
                normal: {
                    // color: 'rgba(133, 165, 184, 0.5)'
                    color: '#89a8b9'
                }
            },
            markPoint: {
                label: {
                    normal: {
                        textStyle: {
                            fontSize: 24
                        }
                    }
                },
                symbolSize: 80,
                data: [{
                    type: 'max',
                    name: '最大值',
                }]
            }
        }, {
            name: '驶出高峰',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    opacity: 0
                }
            },
            lineStyle: {
                normal: {
                    opacity: 0
                }
            },
            areaStyle: {
                normal: {
                    // color: 'rgba(62, 197, 235, 0.5)'
                    color: '#2ec3ed'
                }
            },
            markPoint: {
                label: {
                    normal: {
                        textStyle: {
                            fontSize: 24
                        }
                    }
                },
                symbolSize: 80,
                data: [{
                    type: 'max',
                    name: '最大值'
                }]
            },
        }]
    };

    function parseData(resIn, resOut) {
        var x = genX(resIn, resOut);
        var dataIn = Array(x.length).fill(0);
        var dataOut = Array(x.length).fill(0);
        resIn.forEach(function (data) {
            dataIn[x.indexOf(moment(data.key).format('H:00'))] = data.doc_count;
        });
        resOut.forEach(function (data) {
            dataOut[x.indexOf(moment(data.key).format('H:00'))] = data.doc_count;
        });
        return {
            x: x,
            dataIn: dataIn,
            dataOut: dataOut
        }
    }

    function genX(resIn, resOut) {
        var x = _.unionBy(resIn, resOut, 'key');
        x = _.map(x, 'key').sort();
        return x.map(function (o) {
            return moment(o).format('H:00');
        });
    }

    var myChart;
    var ParkingChart = {
        init: function (elem) {
            myChart = echarts.init(elem);
            myChart.setOption(option);
        },
        setData: function () {
            ParkingService.getCarInOut().then(function (res) {
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