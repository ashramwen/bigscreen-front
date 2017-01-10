'use strict';

angular.module('BigScreen.Portal').factory('ElectricityService', ['$q', '$$Thing', 'ApiService', function ($q, $$Thing, ApiService) {
    var whPromises = [];
    var electricity = {};
    var electricityThings = [{
        vendorThingID: '0807W-Z00-N-002',
        type: 'airLighting'
    }, {
        vendorThingID: '0807W-Z00-N-034',
        type: 'airLighting'
    }, {
        vendorThingID: '0807W-Z00-N-003',
        type: 'socket'
    }, {
        vendorThingID: '0807W-Z00-N-035',
        type: 'socket'
    }];

    function reset() {
        electricity = {
            airLighting: {
                yesterday: numeral(0),
                lastWeek: numeral(0)
            },
            socket: {
                yesterday: numeral(0),
                lastWeek: numeral(0)
            }
        }
    }

    function calLastWeek(data) {
        var yesterday = data.yesterday.value()
        data.lastWeek.divide(7);
        var lastWeekValue = data.lastWeek.value();
        data.lastWeekValue = numeral(yesterday).subtract(lastWeekValue).divide(lastWeekValue);
        data.lastWeek = data.lastWeekValue.format('+0%');
        data.yesterday = yesterday;
    }

    function processElectricity() {
        calLastWeek(electricity.airLighting);
        calLastWeek(electricity.socket);
    }

    function sumWh(aggregations, type, property) {
        var max = aggregations.maxValue.value || 0;
        var min = aggregations.minValue.value || 0;
        electricity[type][property] = electricity[type][property].add(max).subtract(min);
    }

    // get used Wh of yesterday
    function getYesterdayWh(thing, type, property) {
        var promise = ApiService.Environment.searchHistoryStatesAggregation({}, {
            'thingID': thing.kiiThingID,
            'stateField': 'state.Wh',
            'startDateTime': moment().subtract(1, 'days').startOf('day').valueOf(),
            'endDateTime': moment().startOf('day').valueOf()
        }).$promise;
        promise.then(function (res) {
            sumWh(res.aggregations, type, 'yesterday');
        });
        return promise;
    }

    // get used Wh of last week
    function getLastWeekWh(thing, type, property) {
        var promise = ApiService.Environment.searchHistoryStatesAggregation({}, {
            'thingID': thing.kiiThingID,
            'stateField': 'state.Wh',
            'startDateTime': moment().day(-7).startOf('day').valueOf(),
            'endDateTime': moment().day(0).startOf('day').valueOf()
        }).$promise;
        promise.then(function (res) {
            sumWh(res.aggregations, type, 'lastWeek');
        });
        return promise;
    }

    // get kiiThingID and call wh API
    function queryThingInfo(vendorThingID, type) {
        whPromises = [];
        var promises = [];
        electricityThings.forEach(function (meter) {
            var p = ApiService.Environment.queryThingInfo({
            // var p = $$Thing.getThingsByVendorID({
                vendorThingID: meter.vendorThingID
            }).$promise;
            p.then(function (thing) {
                whPromises.push(getYesterdayWh(thing, meter.type));
                whPromises.push(getLastWeekWh(thing, meter.type));
            });
            promises.push(p)
        });
        return promises;
    }

    var ElectricityService = {
        getWh: function () {
            reset();
            var q = $q.defer();
            $q.all(queryThingInfo()).then(function (res) {
                return $q.all(whPromises);
            }).then(function (res) {
                processElectricity();
                q.resolve(electricity);
            });
            return q.promise;
        }
    };
    return ElectricityService;
}]);