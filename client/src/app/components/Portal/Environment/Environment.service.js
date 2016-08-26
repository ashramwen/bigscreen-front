'use strict';

angular.module('BigScreen.Portal')

.factory('EnvironmentService', ['$resource', '$q', function($resource, $q) {
    return $resource(thirdPartyAPIUrl, {
        startDateTime: moment().startOf('day').valueOf() / 1000,
        endDateTime: moment().endOf('day').millisecond(0).valueOf() / 1000
    }, {
        getFacialIdentify: {
            url: thirdPartyAPIUrl + 'facialIdentify/aggregate',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer super_token',
                'apiKey': thirdPartyAPIKey
            }
        }
    });
}])

.factory('PopulationChart', ['$rootScope', '$q', 'EnvironmentService', function($rootScope, $q, EnvironmentService) {

    function parseData(buckets, total) {
        var population = {
            total: 0,
            beehive: 0,
            beehive_display: 0,
            guest: 0,
            guest_display: 0
        };
        buckets.forEach(function(bucket) {
            switch (bucket.key) {
                case 'in':
                case 'south_in':
                    population.total += bucket.doc_count;
                    population.guest += getNonBeehiveNumber(bucket);
                    break;
                case 'out':
                case 'south_out':
                    population.total -= bucket.doc_count;
                    population.guest -= getNonBeehiveNumber(bucket);
                    break;
            }
        });
        population.beehive = population.total - population.guest;
        population.beehive_display = calNumber(population.beehive);
        population.guest_display = calNumber(population.guest);
        return population;
    }

    function getNonBeehiveNumber(bucket) {
        var count = 0;
        bucket.beehive_user_count.buckets.forEach(function(b) {
            if (b.key !== 'non_beehive_user') return;
            count = b.doc_count;
            return true;
        });
        return count;
    }

    function calNumber(count) {
        count = Math.floor(count / 10);
        return (count > 10) ? 10 : count;
    }

    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [{
            name: '空间利用率',
            type: 'pie',
            radius: ['30%', '70%'],
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                value: 335,
                name: '人员',
                itemStyle: {
                    normal: {
                        color: '#cae2ef'
                    }
                }
            }, {
                value: 310,
                name: '空',
                itemStyle: {
                    normal: {
                        color: '#48abdd'
                    }
                }
            }]
        }]
    };

    var myChart;

    return {
        init: function(elem, population) {
            var q = $q.defer();
            EnvironmentService.getFacialIdentify().$promise.then(function(res) {
                myChart = echarts.init(elem);
                myChart.setOption(option);
                q.resolve(parseData(res.aggregations.action.buckets));
            }, function() {
                q.reject();
            });
            return q.promise;
        }
    }
}]);