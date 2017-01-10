'use strict';

angular.module('BigScreen.Portal')

.factory('PersonnelService', ['$rootScope', '$q', 'ApiService', 'ThirdPartyWsClient', function ($rootScope, $q, ApiService, ThirdPartyWsClient) {
    function wsSubscribe(callback) {
        ThirdPartyWsClient.subscribe('/topic/facePlusPlus/*', function (msg) {
            callback.apply(this, [msg]);
        });
        // ThirdPartyWsClient.subscribe('/topic/thirdparty/faceplusplus', function (msg) {
        //     callback.apply(this, [msg]);
        // });
    }

    return {
        faceplusplus: function (callback) {
            if (ThirdPartyWsClient.isConnected()) {
                wsSubscribe(callback);
            } else {
                $rootScope.$on('3rd_stomp.connected', function () {
                    wsSubscribe(callback);
                })
            }
            return ThirdPartyWsClient;
        },
        identifyFrequency: function () {
            var data = {
                startDateTime: moment().startOf('day').valueOf(), // 當前時間 0 點
                endDateTime: moment().add(1, 'days').startOf('day').valueOf(), // 次日時間 0 點,
                interval: '10m'
            };
            var dataIn = angular.extend({
                cameraPositions: ['south_in', 'east_in']
            }, data);
            var dataOut = angular.extend({
                cameraPositions: ['south_out', 'east_out']
            }, data);

            var qIn = ApiService.Personneel.identifyFrequency({}, dataIn).$promise;
            var qOut = ApiService.Personneel.identifyFrequency({}, dataOut).$promise;

            var deferred = $q.defer();
            $q.all([qIn, qOut]).then(function (res) {
                var ret = [res[0].aggregations.byInterval.buckets, res[1].aggregations.byInterval.buckets];
                deferred.resolve(ret);
            }, function () {
                deferred.reject();
            });
            return deferred.promise;
        },
        searchByStranger: function () {
            return ApiService.Personneel.searchByStranger({}, {
                startDateTime: moment().subtract(3, 'days').valueOf(), // 當前時間 -3 天
                endDateTime: 9999999999999,
                cameraPositions: ['south_out', 'east_out', 'south_in', 'east_in'],
                orderByTimestamp: 'desc',
                size: 3,
                from: 0
            }).$promise;
        },
        searchLatestRecord: function () {
            return ApiService.Personneel.searchLatestRecord({}, {
                startDateTime: moment().subtract(1, 'days').startOf('day').valueOf(), // 前一天 0 點
                endDateTime: moment().startOf('day').valueOf(), // 今天 0 點
                cameraPositions: ['south_out', 'east_out', 'south_in', 'east_in']
            }).$promise;
        }
    }
}])

.factory('PersonnelChart', ['$rootScope', 'PersonnelService', function ($rootScope, PersonnelService) {
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            // minData: '0:00',
            axisLabel: {
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
            name: '进入',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    opacity: 0
                }
            },
            lineStyle: {
                normal: {
                    width: 0
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
                        formatter: function(max) {
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
            name: '离开',
            type: 'line',
            smooth: true,
            itemStyle: {
                normal: {
                    opacity: 0
                }
            },
            lineStyle: {
                normal: {
                    width: 0
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
                        formatter: function(max) {
                            var time = data.x[max.data.coord[0]];
                            return '离开高峰 \n' + max.value + '  ' + time + ' ';
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

    function parseData(resIn, resOut) {
        var x = genX(resIn, resOut);
        var dataIn = Array(x.length).fill(0);
        var dataOut = Array(x.length).fill(0);
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
        x = _.map(x, 'key').sort();
        return x.map(function (o) {
            return moment(o).add(10, 'm').format('H:mm');
        });
    }

    var myChart;
    var data;
    var PersonnelChart = {
        init: function (elem) {
            myChart = echarts.init(elem);
            myChart.setOption(option);
        },
        setData: function () {
            PersonnelService.identifyFrequency().then(function (res) {
                data = parseData(res[0], res[1]);
                myChart.setOption({
                    xAxis: {
                        data: data.x
                    },
                    series: [{
                        name: '进入',
                        data: data.dataIn
                    }, {
                        name: '离开',
                        data: data.dataOut
                    }]
                });
            });
        }
    };

    return PersonnelChart;
}]);