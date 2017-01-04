'use strict';

angular.module('BigScreen.Portal')

.factory('EnvironmentService', ['$q', '$$Thing', 'ApiService', function ($q, $$Thing, ApiService) {
    var electricityThings = [5494, 5495, 4928, 5496, 5498, 5497];

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

    var coefficient = .3;
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
        population.guest = Math.round(population.guest * coefficient);
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

    var electricity = {};

    function getWhByThings(things) {
        var whPromise = [];
        electricity = {
            airLighting: {
                yesterday: numeral(),
                lastWeek: numeral()
            },
            socket: {
                yesterday: numeral(),
                lastWeek: numeral()
            }
        }
        things.forEach(function (thing) {
            var y = ApiService.Environment.searchHistoryStatesAggregation({}, {
                'thingID': thing.kiiThingID,
                'stateField': 'state.Wh',
                'startDateTime': moment().subtract(1, 'days').startOf('day').valueOf(),
                'endDateTime': moment().startOf('day').valueOf()
            }).$promise;
            whPromise.push(y);
            y.then(function (res) {
                calWh(thing.id, res.aggregations, 'yesterday');
            });

            var w = ApiService.Environment.searchHistoryStatesAggregation({}, {
                'thingID': thing.kiiThingID,
                'stateField': 'state.Wh',
                'startDateTime': moment().day(-7).startOf('day').valueOf(),
                'endDateTime': moment().day(0).startOf('day').valueOf()
            }).$promise
            whPromise.push(w);
            w.then(function (res) {
                calWh(thing.id, res.aggregations, 'lastWeek');
            });
        });
        return whPromise;
    }

    function processElectricity() {
        calLastWeek(electricity.airLighting);
        calLastWeek(electricity.socket);
    }

    function calLastWeek(data) {
        var yesterday = data.yesterday.value()
        data.lastWeek.divide(7);
        data.lastWeek = numeral(yesterday).subtract(data.lastWeek).divide(data.lastWeek).format('+0%');
        data.yesterday = yesterday;
    }

    function calWh(globalThingID, data, property) {
        var max = numeral(data.maxValue.value);
        var min = numeral(data.minValue.value);
        switch (globalThingID) {
            case 5494:
            case 5495:
            case 4928:
            case 5496:
                electricity.airLighting[property].add(max.subtract(min));
                break;
            case 5498: //0807W-Z00-N-003
            case 5497: //0807W-Z00-N-035
                electricity.socket[property].add(max.subtract(min));
                break;
        }
    }

    return {
        getThingsLatestStatus: function () {
            var q = $q.defer();
            ApiService.Environment.getThingsLatestStatus({
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
            ApiService.Environment.getFacialIdentify({
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
            ApiService.Environment.searchThings({
                location: '0807W',
                includeSubLevel: true,
                type: 'EnvironmentSensor'
            }).$promise.then(function (res) {
                var _thingList = res.things.map(function (o) {
                    return o.thingID;
                });
                return ApiService.Environment.detectPIR({
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
            ApiService.Environment.getElectricMeter({}, {
                'thingList': electricityThings
            }).$promise.then(function (res) {
                q.resolve(sumWh(res));
            }, function (err) {
                q.reject(err);
            });
            return q.promise;
        },
        getElectricMeterP: function () {
            var q = $q.defer();
            ApiService.Environment.getElectricMeterP().$promise.then(function (res) {
                q.resolve(sumP(res));
            }, function (err) {
                q.reject(err);
            });
            return q.promise;
        },
        getWh: function () {
            var q = $q.defer();
            $$Thing.getThingsByIDs(electricityThings).$promise.then(function (res) {
                var whPromise = getWhByThings(res);
                $q.all(whPromise).then(function (res) {
                    processElectricity();
                    q.resolve(electricity);
                });
            });
            return q.promise;
        }
    }
}]);