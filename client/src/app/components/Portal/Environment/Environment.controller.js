'use strict';

angular.module('BigScreen.Portal')

.controller('EnvironmentController', ['$scope', '$interval', 'EnvironmentService', function($scope, $interval, EnvironmentService) {

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

    var myChart = echarts.init(document.getElementById('population-chart'));
    $scope.init = function() {
        // show people
        EnvironmentService.showPeople().then(function(res) {
            $scope.population = res;
        });

        // space usage
        EnvironmentService.usage().then(function(res) {
            $scope.usage = res.pir / res.space;
            myChart.setOption(chartOption(res));
        });

        // right side sensor state
        EnvironmentService.getThingsLatestStatus().then(function(res) {
            getStatus(res);
        });
    }

    var stop = $interval(function() {
        $scope.init();
    }, 60000);

    $scope.$on('$destroy', function() {
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
            res.aggregations.group_by_target.buckets.forEach(function(thing) {
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
            }
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

    function chartOption(states) {
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
                    value: states.space,
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