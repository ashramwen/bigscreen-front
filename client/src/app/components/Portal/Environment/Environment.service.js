'use strict';

angular.module('BigScreen.Portal')

.factory('EnvironmentService', ['$resource', '$q', 'SessionService', function ($resource, $q, SessionService) {
    var _user = SessionService.getPortalAdmin();
    var query = $resource(thirdPartyAPIUrl, {}, {
        getFacialIdentify: {
            url: thirdPartyAPIUrl + 'facialIdentify/aggregate',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + _user.accessToken,
                'apiKey': thirdPartyAPIKey
            },
            params: {
                startDateTime: '@startDateTime',
                endDateTime: '@endDateTime'
            }
        },
        getThingsLatestStatus: {
            url: thirdPartyAPIUrl + 'dataUtilization/ThingsLatestStatusQuery',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + _user.accessToken,
                'apiKey': thirdPartyAPIKey
            },
            params: {
                // 'index': '493e83c9',
                'startDateTime': '@startDateTime',
                'endDateTime': '@endDateTime'
            }
        },
        searchThings: {
            url: thirdPartyAPIUrl + 'locationTag/searchThings',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + _user.accessToken,
                'apiKey': thirdPartyAPIKey
            },
            transformResponse: function (data) {
                return {
                    things: angular.fromJson(data)
                }
            }
        },
        detectPIR: {
            url: thirdPartyAPIUrl + 'EnvironmentSensor/PIR',
            method: 'POST',
            isArray: true,
            headers: {
                'Authorization': 'Bearer ' + _user.accessToken,
                'apiKey': thirdPartyAPIKey
            }
        },
        getElectricMeter: {
            url: thirdPartyAPIUrl + 'ElectricMeter/Wh',
            method: 'POST',
            isArray: true,
            headers: {
                'Authorization': 'Bearer ' + _user.accessToken,
                'apiKey': thirdPartyAPIKey
            }
        },
        getElectricMeterP: {
            url: thirdPartyAPIUrl + 'ElectricMeter/P',
            method: 'POST',
            isArray: true,
            headers: {
                'Authorization': 'Bearer ' + _user.accessToken,
                'apiKey': thirdPartyAPIKey
            }
        }
    });

    function getNonBeehiveNumber(bucket) {
        var count = 0;
        bucket.beehive_user_count.buckets.forEach(function (b) {
            if (b.key !== 'non_beehive_user') return;
            count = b.doc_count;
            return true;
        });
        return count;
    }

    function calNumber(count) {
        if (count === 0) return 0;
        count = Math.floor(count / 10) + 1;
        return (count > 10) ? 10 : count;
    }

    // 3.a. calculate how many people are in the office
    function parseFacialData(buckets, total) {
        var population = {
            total: 0,
            beehive: 0,
            beehive_display: 0,
            guest: 0,
            guest_display: 0
        };
        buckets.forEach(function (bucket) {
            switch (bucket.key) {
                case 'east_in':
                case 'south_in':
                    population.total += bucket.doc_count;
                    population.guest += getNonBeehiveNumber(bucket);
                    break;
                case 'east_out':
                case 'south_out':
                    population.total -= bucket.doc_count;
                    population.guest -= getNonBeehiveNumber(bucket);
                    break;
            }
        });
        population.beehive = population.total - population.guest;

        // for test
        // population.beehive = 22;
        // population.guest = 14;

        // population.beehive = (population.beehive < 0 ? 0 : population.beehive);
        // population.guest = (population.guest < 0 ? 0 : population.guest);

        population.beehive_display = calNumber(population.beehive);
        population.guest_display = calNumber(population.guest);
        return population;
    }

    // 3.b. calculate how many people came office
    function calculateComeInPeople(buckets, total) {
        var population = {
            beehive: 0,
            beehive_display: 0,
            guest: 0,
            guest_display: 0
        };
        var eastList;
        var southList;
        buckets.forEach(function (bucket) {
            switch (bucket.key) {
                case 'east_in':
                    eastList = bucket.beehive_user_count.buckets;
                    population.guest += getNonBeehiveNumber(bucket);
                    population.beehive += bucket.beehive_user_count.buckets.length - 1;
                    break;
                case 'south_in':
                    southList = bucket.beehive_user_count.buckets;
                    population.guest += getNonBeehiveNumber(bucket);
                    population.beehive += bucket.beehive_user_count.buckets.length - 1;
                    break;
                case 'east_out':
                case 'south_out':
                    // population.total -= bucket.doc_count;
                    break;
            }
        });

        var dup = _.intersectionBy(eastList, southList, 'key');
        var dup_count = dup.length;
        if (dup.find(function (o) {
                return o.key === 'non_beehive_user';
            })) {
            dup_count--;
        }
        population.beehive -= dup_count;
        population.beehive_display = calNumber(population.beehive);
        population.guest_display = calNumber(population.guest);
        return population;
    }

    function sumP(res) {
        return sum(res, 'P');
    }

    function sumWh(res) {
        return sum(res, 'Wh');
    }

    function sum(res, column) {
        var ret = {
            airLighting: numeral(),
            socket: numeral(),
        };
        res.forEach(function (o) {
            switch (o.globalThingID) {
                case 5494:
                case 5495:
                case 4928:
                case 5496:
                    ret.airLighting.add(o.states[column] || 0);
                    break;
                case 5498: //0807W-Z00-N-003
                case 5497: //0807W-Z00-N-035
                    ret.socket.add(o.states[column] || 0);
                    break;
            }
        });
        return {
            airLighting: ret.airLighting.value(),
            socket: ret.socket.value()
        };
    }

    return {
        getThingsLatestStatus: function () {
            var q = $q.defer();
            query.getThingsLatestStatus({
                'startDateTime': moment().startOf('day').valueOf(),
                'endDateTime': 9999999999999
            }).$promise.then(function (res) {
                q.resolve(res);
            }, function (err) {
                q.reject(err);
            });
            return q.promise;
        },
        showPeople: function () {
            var q = $q.defer();
            query.getFacialIdentify({
                startDateTime: moment().startOf('day').valueOf(),
                endDateTime: moment().endOf('day').millisecond(0).valueOf()
            }).$promise.then(function (res) {
                try {
                    q.resolve(calculateComeInPeople(res.aggregations.action.buckets));
                } catch (e) {
                    console.log('no facial identify data.')
                    q.resolve(calculateComeInPeople([]));
                }
            }, function (err) {
                q.reject(err);
            });
            return q.promise;
        },
        usage: function () {
            var q = $q.defer();
            query.searchThings({
                location: '0807W',
                includeSubLevel: true,
                type: 'EnvironmentSensor'
            }).$promise.then(function (res) {
                var _thingList = res.things.map(function (o) {
                    return o.thingID;
                });
                return query.detectPIR({
                    thingList: _thingList
                }).$promise;
            }).then(function (res) {
                var _pir = 0;
                res.forEach(function (thing) {
                    if (thing.states.PIR) _pir++;
                });
                q.resolve({
                    pir: _pir,
                    space: res.length
                });
            }, function (err) {
                q.reject(err);
            });
            return q.promise;
        },
        getElectricMeter: function () {
            var q = $q.defer();
            query.getElectricMeter({}, {
                'thingList': [5494, 5495, 4928, 5496, 5498, 5497]
            }).$promise.then(function (res) {
                q.resolve(sumWh(res));
            }, function (err) {
                q.reject(err);
            });
            return q.promise;
        },
        getElectricMeterP: function () {
            var q = $q.defer();
            query.getElectricMeterP({}, {
                'thingList': [5494, 5495, 4928, 5496, 5498, 5497]
            }).$promise.then(function (res) {
                q.resolve(sumP(res));
            }, function (err) {
                q.reject(err);
            });
            return q.promise;
        }
    }
}]);