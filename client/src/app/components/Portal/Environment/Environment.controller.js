'use strict';

angular.module('BigScreen.Portal')

.controller('EnvironmentController', ['$scope', 'EnvironmentService', 'PopulationChart', function($scope, EnvironmentService, PopulationChart) {

    $scope.population = {
        total: 0,
        beehive: 0,
        beehive_display: 0,
        guest: 0,
        guest_display: 0
    }

    $scope.init = function() {
        PopulationChart.init(document.getElementById('population-chart')).then(function(res) {
            $scope.population = res;
        });

        $scope.status = {
            temp: NaN,
            co2: NaN,
            pm25: NaN
        }

        EnvironmentService.getThingsLatestStatus({}, {
            'index': '192b49ce',
            'startDateTime': moment().startOf('day').valueOf(),
            'endDateTime': 9999999999999
        }).$promise.then(function(res) {
            getStatus(res);
        });
    }

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
                temp = getStateValue(thing, 'Temp');
                if (temp !== undefined) {
                    tempTotal += temp;
                    tempCount++;
                    console.log(temp);
                }
                co2 = getStateValue(thing, 'CO2');
                if (co2 !== undefined) {
                    co2Total += co2;
                    co2Count++;
                }
                pm25 = getStateValue(thing, 'PM25');
                if (pm25 !== undefined) {
                    pm25Total += pm25;
                    pm25Count++;
                }
            });
            $scope.status = {
                temp: (parseFloat(tempTotal) / tempCount).toFixed(1),
                co2: (co2Total / co2Count).toFixed(0),
                pm25: (pm25Total / pm25Count).toFixed(0)
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
}]);