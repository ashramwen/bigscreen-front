'use strict';

angular.module('BigScreen.Portal')

.factory('EnvironmentService', ['$resource', '$q', function($resource, $q) {
    var query = $resource(thirdPartyAPIUrl, {}, {
        getFacialIdentify: {
            url: thirdPartyAPIUrl + 'facialIdentify/aggregate',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer super_token',
                'apiKey': thirdPartyAPIKey
            },
            params: {
                startDateTime: moment().startOf('day').valueOf(),
                endDateTime: moment().endOf('day').millisecond(0).valueOf()
            }
        },
        getThingsLatestStatus: {
            url: thirdPartyAPIUrl + 'dataUtilization/ThingsLatestStatusQuery',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer super_token',
                'apiKey': thirdPartyAPIKey
            },
            params: {
                'index': '493e83c9',
                'startDateTime': moment().startOf('day').valueOf(),
                'endDateTime': 9999999999999
            }
        },
        searchThings: {
            url: thirdPartyAPIUrl + 'locationTag/searchThings',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer super_token',
                'apiKey': thirdPartyAPIKey
            },
            transformResponse: function(data) {
                return { things: angular.fromJson(data) }
            }
        },
        detectPIR: {
            url: thirdPartyAPIUrl + 'EnvironmentSensor/PIR',
            method: 'POST',
            isArray: true,
            headers: {
                'Authorization': 'Bearer super_token',
                'apiKey': thirdPartyAPIKey
            }
        }
    });

    function parseFacialData(buckets, total) {
        var population = {
            total: 0,
            beehive: 0,
            beehive_display: 0,
            guest: 0,
            guest_display: 0
        };
        buckets.forEach(function(bucket) {
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
        if (count === 0) return 0;
        count = Math.floor(count / 10) + 1;
        return (count > 10) ? 10 : count;
    }

    return {
        getThingsLatestStatus: function() {
            var q = $q.defer();
            query.getThingsLatestStatus().$promise.then(function(res) {
                q.resolve(res);
            }, function(err) { q.reject(err); });
            return q.promise;
        },
        showPeople: function() {
            var q = $q.defer();
            query.getFacialIdentify().$promise.then(function(res) {
                try {
                    q.resolve(parseFacialData(res.aggregations.action.buckets));
                } catch (e) {
                    console.log('no facial identify data.')
                    q.resolve(parseFacialData([]));
                }
            }, function(err) { q.reject(err); });
            return q.promise;
        },
        usage: function() {
            var q = $q.defer();
            query.searchThings({
                location: '0807W',
                includeSubLevel: true,
                type: 'EnvironmentSensor'
            }).$promise.then(function(res) {
                return query.detectPIR({ thingList: res.things }).$promise;
            }).then(function(res) {
                var _pir = 0;
                res.forEach(function(thing) {
                    if (thing.states.PIR) _pir++;
                });
                var a = 1;
                q.resolve({
                    pir: _pir,
                    space: res.length
                });
            }, function(err) { q.reject(err); });
            return q.promise;
        }
    }
}]);