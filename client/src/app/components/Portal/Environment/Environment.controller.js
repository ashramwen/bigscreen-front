'use strict';

angular.module('BigScreen.Portal')

    .controller('EnvironmentController', ['$scope', '$interval', 'EnvironmentService', function ($scope, $interval, EnvironmentService) {

        $scope.population = {
            total: 0,
            beehive: 0,
            beehive_display: 0,
            guest: 0,
            guest_display: 0
        }

        $scope.usage = 0;

        $scope.status = {
            temp: NaN,
            co2: NaN,
            pm25: NaN
        }

        // $scope.electricity = {
        //     airLighting: 0,
        //     socket: 0
        // }

        var pirChart = echarts.init(document.getElementById('population-chart'));
        var electricityChart = echarts.init(document.getElementById('electricity-chart'));
        $scope.init = function () {
            // show people
            EnvironmentService.showPeople().then(function (res) {
                $scope.population = res;
            });

            // space usage
            EnvironmentService.usage().then(function (res) {
                $scope.usage = res.pir / res.space;
                pirChart.setOption(pirChartOption(res));
            });

            // right side sensor state
            EnvironmentService.getThingsLatestStatus().then(function (res) {
                getStatus(res);
            });

            // get electric meter Wh
            EnvironmentService.getWh().then(function (data) {
                // console.log(data);
                electricityChart.setOption(electricChartOption(data));
                $scope.electricityReady = true;
            });

            // get electric meter P
            // EnvironmentService.getElectricMeterP().then(function (data) {
            //     $scope.electricity = data;
            //     electricityChart.setOption(electricChartOption(data));
            //     $scope.electricityReady = true;
            // });
        }

        var stop = $interval(function () {
            $scope.init();
        }, 60000);

        $scope.$on('$destroy', function () {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
        });

        function getStatus(res) {
            try {
                var temp;
                var tempTotal = 0;
                var tempCount = 0;
                var co2;
                var co2Total = 0;
                var co2Count = 0;
                var pm25;
                var pm25Total = 0;
                var pm25Count = 0;
                res.aggregations.group_by_target.buckets.forEach(function (thing) {
                    // console.log(thing.key);
                    temp = getStateValue(thing, 'Temp');
                    if (temp !== undefined) {
                        // console.log('temp', temp);
                        tempTotal += temp;
                        tempCount++;
                    }
                    co2 = getStateValue(thing, 'CO2');
                    if (co2 !== undefined) {
                        co2Total += co2;
                        co2Count++;
                    }
                    pm25 = getStateValue(thing, 'PM25');
                    if (pm25 !== undefined) {
                        // console.log('pm25', pm25);
                        pm25Total += pm25;
                        pm25Count++;
                    }
                });
                temp = tempCount ? (parseFloat(tempTotal) / tempCount).toFixed(1) : NaN;
                co2 = co2Count ? (co2Total / co2Count).toFixed(0) : NaN;
                pm25 = pm25Count ? (pm25Total / pm25Count).toFixed(0) : NaN;
                $scope.status = {
                    temp: parseFloat(temp),
                    co2: parseInt(co2),
                    pm25: parseInt(pm25)
                };
                statusLevel();
            } catch (e) {
                console.warn('ThingsLatestStatus data error.')
            }
        }

        function getStateValue(thing, state) {
            try {
                return thing.latest_record.hits.hits[0]._source.state[state];
            } catch (e) {
                return undefined;
            }
        }

        function statusLevel() {
            $scope.tempLevel = statusTempLevel($scope.status.temp);
            $scope.co2Level = statusCo2Level($scope.status.co2);
            $scope.pm25Level = statusPm25Level($scope.status.pm25);
            var a = 1;
        }

        function statusTempLevel(input) {
            if (isNaN(input)) return;
            if (input <= 4) {
                return {
                    text: '很冷',
                    level: 'bad'
                }
            };
            if (input <= 8) {
                return {
                    text: '冷',
                    level: 'bad'
                }
            };
            if (input <= 13) {
                return {
                    text: '凉',
                    level: 'normal'
                }
            };
            if (input <= 18) {
                return {
                    text: '凉爽',
                    level: 'normal'
                }
            };
            if (input <= 23) {
                return {
                    text: '舒适',
                    level: 'good'
                }
            };
            if (input <= 29) {
                return {
                    text: '温暖',
                    level: 'good'
                }
            };
            if (input <= 35) {
                return {
                    text: '热',
                    level: 'bad'
                }
            };
            return {
                text: '炎热',
                level: 'bad'
            };
        }

        function statusCo2Level(input) {
            if (isNaN(input)) return '';
            if (input <= 600) return {
                text: '优',
                level: 'good'
            };
            if (input <= 1000) return {
                text: '良',
                level: 'normal'
            };
            return {
                text: '劣',
                level: 'bad'
            };
        }

        function statusPm25Level(input) {
            if (isNaN(input)) return '';
            if (input <= 35) return {
                text: '优',
                level: 'good'
            };
            if (input <= 75) return {
                text: '良',
                level: 'good'
            };
            if (input <= 115) return {
                text: '轻度污染',
                level: 'normal'
            };
            if (input <= 150) return {
                text: '中度污染',
                level: 'bad'
            };
            if (input <= 250) return {
                text: '重度污染',
                level: 'bad'
            };
            return {
                text: '严重污染',
                level: 'bad'
            };
        }

        function electricChartOption(data) {
            return {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} kW ({d}%)"
                },
                legend: {
                    // orient: 'vertical',
                    // x: 'right',
                    // data: ['照明+空调', '插座'],
                    // textStyle: {
                    //     fontSize: 18
                    // }
                    // formatter: function(name) {
                    //     var oa = option.series[0].data;
                    //     var num = oa[0].value + oa[1].value;
                    //     for (var i = 0; i < option.series[0].data.length; i++) {
                    //         if (name == oa[i].name) {
                    //             return name + '     ' + oa[i].value + '     ' + (oa[i].value / num * 100).toFixed(2) + '%';
                    //         }
                    //     }
                    // }
                },
                series: [{
                    center: ['45%', '50%'],
                    name: '能耗分析',
                    type: 'pie',
                    // radius: '60%',
                    data: [{
                        value: Math.round(data.airLighting.yesterday),
                        name: '照明+空调',
                        itemStyle: {
                            normal: {
                                color: '#ff6600'
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                // position: 'inside',
                                formatter: function (a) {
                                    // return data.airLighting.lastWeek + '\n照明+空调\n' + a.value + ' WH';
                                    return '照明+空调\n' + a.value + ' WH\n' + data.airLighting.lastWeek + ' (上周均值比)';
                                },
                                textStyle: {
                                    fontSize: 30
                                }
                            }
                        },
                        selected: true
                    }, {
                        value: Math.round(data.socket.yesterday),
                        name: '插座',
                        itemStyle: {
                            normal: {
                                color: '#2aabe2'
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                // position: 'inside',
                                formatter: function (a) {
                                    // return data.socket.lastWeek + '\n插座\n' + a.value + ' WH';
                                    return '插座\n' + a.value + ' WH\n' + data.socket.lastWeek + ' (上周均值比)';
                                },
                                textStyle: {
                                    fontSize: 30
                                }
                            }
                        }
                    }],
                    label: {
                        // normal: {
                        //     show: true,
                        //     position: 'inside',
                        //     formatter: '{b}\n{c} kW',
                        //     textStyle: {
                        //         fontSize: 24
                        //     }
                        // },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    labelLine: {
                        show: true
                    }
                }]
            };
        }

        function pirChartOption(states) {
            return {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [{
                    name: '空间利用率',
                    type: 'pie',
                    radius: ['30%', '70%'],
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [{
                        value: states.pir,
                        name: '人员',
                        itemStyle: {
                            normal: {
                                color: '#48abdd'
                            }
                        }
                    }, {
                        value: states.space - states.pir,
                        name: '空',
                        itemStyle: {
                            normal: {
                                color: '#cae2ef'
                            }
                        }
                    }]
                }]
            };
        }
    }]);