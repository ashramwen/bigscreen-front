'use strict';

angular.module('BigScreen.Portal')

.factory('PopulationService', ['$resource', '$q', function($resource, $q) {
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

.factory('PopulationChart', ['$rootScope', 'PopulationService', function($rootScope, PopulationService) {
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
    var Chart = {
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

    return Chart;
}]);