'use strict';

angular.module('BigScreen.AppShared')

.factory('GeoService', ['$rootScope', '$resource', '$q', function($rootScope, $resource, $q) {

    var GPS = $resource(thirdPartyAPIUrl, {
        startTime: moment().startOf('hour').hour(8).valueOf(),
        endTime: moment().startOf('hour').hour(20).valueOf(),
        interval: '1h'
    }, {
        getCarInFrequency: {
            url: thirdPartyAPIUrl + 'carparking/CarInFrequency',
            method: 'GET',
            headers: {
                'apiKey': thirdPartyAPIKey
            }
        },
        getCarOutFrequency: {
            url: thirdPartyAPIUrl + 'carparking/CarOutFrequency',
            method: 'GET',
            headers: {
                'apiKey': thirdPartyAPIKey
            },
        },
        leaveAvgTime: {
            url: thirdPartyAPIUrl + 'carparking/leaveAvgTime',
            method: 'GET',
            headers: {
                'apiKey': thirdPartyAPIKey
            },
            params: {
                startTime: moment().subtract(1, 'days').startOf('day').valueOf(),
                endTime: moment().valueOf(),
            },
            transformResponse: function(data) {
                return {
                    time: angular.fromJson(data)
                }
            }
        }
    });

    return {
        get: function() {
            var q = $q.defer();
            setTimeout(function() {
                q.resolve({
                    lng: 120.028456,
                    lat: 30.278226
                });
            }, 100);
            return q.promise;
        }
    }
}]);