'use strict';

angular.module('BigScreen.Portal')

.factory('BookingService', ['$resource', '$q', 'SessionService', function ($resource, $q, SessionService) {
    var _user = SessionService.getPortalAdmin();
    var Booking = $resource(thirdPartyAPIUrl + 'dataUtilization/fetchBookListByRoomId', {
        sign: '@sign',
        id: '@id'
    }, {
        get: {
            headers: {
                Authorization: 'Bearer ' + _user.accessToken,
                apiKey: thirdPartyAPIKey
            }
        }
    });

    return Booking;
}]);