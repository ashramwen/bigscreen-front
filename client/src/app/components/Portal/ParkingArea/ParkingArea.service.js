// ParkingArea
'use strict';

angular.module('BigScreen.Portal')

.factory('ParkingService', ['$resource', function($resource) {
    var ParkingService = $resource(thirdPartyAPIUrl, {}, {
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

    return ParkingService;
}])

.factory('ParkingChart', ['$resource', function($resource) {
    var ParkingService = $resource(thirdPartyAPIUrl, {}, {
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

    return ParkingService;
}]);