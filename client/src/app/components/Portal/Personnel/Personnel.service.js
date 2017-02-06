'use strict';

angular.module('BigScreen.Portal')

    .factory('PersonnelService', ['$rootScope', '$q', 'ApiService', function ($rootScope, $q, ApiService) {
        // function wsSubscribe(callback) {
        //     ThirdPartyWsClient.subscribe('/topic/facePlusPlus/*', function (msg) {
        //         callback.apply(this, [msg]);
        //     });
        // }

        return {
            // faceplusplus: function (callback) {
            //     if (ThirdPartyWsClient.isConnected()) {
            //         wsSubscribe(callback);
            //     } else {
            //         $rootScope.$on('3rd_stomp.connected', function () {
            //             wsSubscribe(callback);
            //         })
            //     }
            //     return ThirdPartyWsClient;
            // },
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
            getYesterdayRecord: function () {
                return ApiService.Personneel.searchLatestRecord({}, {
                    startDateTime: moment().subtract(1, 'days').startOf('day').valueOf(), // 前一天 0 點
                    endDateTime: moment().startOf('day').valueOf(), // 今天 0 點
                    cameraPositions: ['south_out', 'east_out', 'south_in', 'east_in']
                }).$promise;
            },
            getTodayRecord: function () {
                return ApiService.Personneel.searchLatestRecord({}, {
                    startDateTime: moment().startOf('day').valueOf(), // 今天 0 點
                    endDateTime: moment().endOf('day').valueOf(), // the end of today
                    cameraPositions: ['south_out', 'east_out', 'south_in', 'east_in']
                }).$promise;
            }
        }
    }])

    .factory('PersonnelChart', ['$rootScope', '$q', 'PersonnelService', function ($rootScope, $q, PersonnelService) {
        var symbolPath = 'path://M 5.477 69.249 l 89.081 9.082 v 46.07 c 0 5.522 4.477 10 10 10 h 304 c 5.522 0 10 -4.478 10 -10 v -112 c 0 -5.523 -4.478 -10 -10 -10 h -304 c -5.523 0 -10 4.477 -10 10 v 46.07';
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
                    symbol: symbolPath,
                    symbolSize: [156, 70],
                    symbolOffset: ['78', 0],
                    itemStyle: {
                        normal: {
                            color: '#ff6600'
                        }
                    },
                    label: {
                        normal: {
                            textStyle: {
                                fontSize: 24
                            },
                            position: 'insideRight',
                            formatter: function (max) {
                                var time = data.x[max.data.coord[0]];
                                return '进入高峰 \n' + max.value + ' /' + time + ' ';
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
                    symbol: symbolPath,
                    symbolSize: [156, 70],
                    symbolOffset: ['78', 0],
                    itemStyle: {
                        normal: {
                            color: '#2bce10'
                        }
                    },
                    label: {
                        normal: {
                            textStyle: {
                                fontSize: 24
                            },
                            position: 'insideRight',
                            formatter: function (max) {
                                var time = data.x[max.data.coord[0]];
                                return '出去高峰 \n' + max.value + ' /' + time + ' ';
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
            var tenMins = 600000;
            var x = genX(resIn, resOut);
            var dataIn = Array(x.length).fill(0);
            var dataOut = Array(x.length).fill(0);
            resIn.forEach(function (data) {
                dataIn[x.indexOf(data.key)] = data.doc_count;
            });
            resOut.forEach(function (data) {
                dataOut[x.indexOf(data.key)] = data.doc_count;
            });
            x = x.map(function (o) {
                return moment(o + tenMins).format('H:mm');
            });
            return {
                x: x,
                dataIn: dataIn,
                dataOut: dataOut,
                maxIn: _.maxBy(resIn, 'doc_count').key + tenMins,
                maxOut: _.maxBy(resOut, 'doc_count').key + tenMins
            }
        }

        function genX(resIn, resOut) {
            var x = _.unionBy(resIn, resOut, 'key');
            x = _.map(x, 'key').sort();
            return x;
        }

        var myChart;
        var data;
        var PersonnelChart = {
            init: function (elem) {
                myChart = echarts.init(elem);
                myChart.setOption(option);
            },
            setData: function () {
                var defer = $q.defer();
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
                    defer.resolve({
                        'in': data.maxIn,
                        'out': data.maxOut
                    });
                });
                return defer.promise;
            }
        };

        return PersonnelChart;
    }]);