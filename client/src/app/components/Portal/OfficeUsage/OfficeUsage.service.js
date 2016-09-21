'use strict';

angular.module('BigScreen.Portal')

.factory('BookingService', ['$resource', '$q', function($resource, $q) {
    var Booking = $resource(thirdPartyAPIUrl + 'dataUtilization/fetchBookListByRoomId', {
        sign: '@sign',
        id: '@id'
    }, {
        get: {
            headers: { 'apiKey': thirdPartyAPIKey }
        }
    });

    return Booking;
}]);