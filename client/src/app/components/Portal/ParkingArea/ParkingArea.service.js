// ParkingArea
'use strict';

angular.module('BigScreen.Portal')

.factory('ParkingAreaService', ['ApiService', '$resource', '$q', function (ApiService, $resource, $q) {
    var qIn = ApiService.ParkingArea.getCarInFrequency;
    var qOut = ApiService.ParkingArea.getCarOutFrequency;

    return {
        getCarInOut: function () {
            var eight = moment().startOf('hour').hour(8).valueOf();
            var twenty = moment().startOf('hour').hour(20).valueOf();
            var end = new Date().valueOf();
            end -= (end % 600000);
            end = moment(end);
            var time = {
                startTime: eight,
                endTime: eight,
                interval: '10m'
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
            return ApiService.ParkingArea.leaveAvgTime({}, {
                startTime: moment().subtract(1, 'days').startOf('day').valueOf(),
                endTime: moment().valueOf(),
            }).$promise;
        }
    }
}])

.factory('ParkingChart', ['$rootScope', 'ParkingAreaService', function ($rootScope, ParkingAreaService) {
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel: {
                interval: 5,
                textStyle: {
                    fontSize: 24
                }
                // formatter: function(value, index) {
                //     return moment(value).format('H:mm');
                // }
            }
        },
        yAxis: {
            type: 'value',
            // boundaryGap: false,
            axisLabel: {
                textStyle: {
                    fontSize: 24
                },
                formatter: function (value, index) {
                    if (value !== 0)
                        return value;
                }
            }
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
                symbol: 'path://M 5.477 69.249 l 89.081 9.082 v 46.07 c 0 5.522 4.477 10 10 10 h 304 c 5.522 0 10 -4.478 10 -10 v -112 c 0 -5.523 -4.478 -10 -10 -10 h -304 c -5.523 0 -10 4.477 -10 10 v 46.07',
                symbolSize: [156, 70],
                symbolOffset: ['78', 0],
                label: {
                    normal: {
                        textStyle: {
                            fontSize: 24
                        },
                        position: 'insideRight',
                        formatter: function (max) {
                            var time = data.x[max.data.coord[0]];
                            return '进入高峰 \n' + max.value + '  ' + time + ' ';
                        }
                    }
                },
                data: [{
                    type: 'max',
                    name: '最大值'
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
                symbol: 'path://M 5.477 69.249 l 89.081 9.082 v 46.07 c 0 5.522 4.477 10 10 10 h 304 c 5.522 0 10 -4.478 10 -10 v -112 c 0 -5.523 -4.478 -10 -10 -10 h -304 c -5.523 0 -10 4.477 -10 10 v 46.07',
                symbolSize: [156, 70],
                symbolOffset: ['78', 0],
                label: {
                    normal: {
                        textStyle: {
                            fontSize: 24
                        },
                        position: 'insideRight',
                        formatter: function (max) {
                            var time = data.x[max.data.coord[0]];
                            return '驶出高峰 \n' + max.value + '  ' + time + ' ';
                        }
                    }
                },
                data: [{
                    type: 'max',
                    name: '最大值'
                }]
            }
        }]
    };

    function random(data) {
        for (var i = 0; i < data.length; i++)
            data[i] = Math.floor(Math.random() * 100);
    }

    function parseData(resIn, resOut) {
        var x = genX(resIn, resOut);
        var dataIn = Array(x.length).fill(0);
        var dataOut = Array(x.length).fill(0);
        // if (resIn.length === 0) {
        //     random(dataIn);
        // }
        // if (resOut.length === 0) {
        //     random(dataOut);
        // }
        resIn.forEach(function (data) {
            dataIn[x.indexOf(moment(data.key).add(10, 'm').format('H:mm'))] = data.doc_count;
        });
        resOut.forEach(function (data) {
            dataOut[x.indexOf(moment(data.key).add(10, 'm').format('H:mm'))] = data.doc_count;
        });
        return {
            x: x,
            dataIn: dataIn,
            dataOut: dataOut
        }
    }

    function genX(resIn, resOut) {
        var x = _.unionBy(resIn, resOut, 'key');
        if (x.length === 0) {
            symbolSize = 0;
            return xAxis;
        }
        x = _.map(x, 'key').sort();
        return x.map(function (o) {
            return moment(o).add(10, 'm').format('H:mm');
        });
    }

    function setOpt() {
        myChart.setOption({
            xAxis: {
                data: data.x
            },
            series: [{
                name: '进入高峰',
                data: data.dataIn,
                markPoint: {
                    symbolSize: symbolSize
                }
            }, {
                name: '驶出高峰',
                data: data.dataOut,
                markPoint: {
                    symbolSize: symbolSize
                }
            }]
        });
        console.log(myChart.getOption());
    }

    var SYMBOL_SIZE = [156, 70];
    var symbolSize = SYMBOL_SIZE;
    var xAxis = [];
    var time = moment().startOf('hour').hour(8);
    var twenty = moment().startOf('hour').hour(20).valueOf();
    while (time.valueOf() <= twenty) {
        xAxis.push(time.format('H:mm'));
        time.add(10, 'm');
    }

    var myChart;
    var data;
    var ParkingChart = {
        init: function (elem) {
            myChart = echarts.init(elem);
            myChart.setOption(option);
        },
        setData: function () {
            symbolSize = SYMBOL_SIZE;
            if (moment().startOf('hour').hour(8).add(10, 'm').isAfter(moment())) {
                data = parseData([], []);
                setOpt();
            } else {
                ParkingAreaService.getCarInOut().then(function (res) {
                    data = parseData(res[0], res[1]);
                    setOpt();
                });
            }
        }
    };

    return ParkingChart;
}]);