'use strict';

angular.module('BigScreen.Portal')

.factory('BookingService', ['$resource', '$q', 'SessionService', function($resource, $q, SessionService) {
    var Booking = $resource(thirdPartyAPIUrl + 'dataUtilization/fetchBookListByRoomId', {
        sign: '@sign',
        id: '@id'
    }, {
        get: {
            headers: { 'Authorization': 'Bearer ' + SessionService.getPortalAdmin().accessToken, 'apiKey': thirdPartyAPIKey }
        }
    });

    return Booking;
}]);