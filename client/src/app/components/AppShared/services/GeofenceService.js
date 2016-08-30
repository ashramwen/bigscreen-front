'use strict';

angular.module('BigScreen.AppShared')

.factory('GeofenceService', ['$rootScope', function($rootScope) {
    var scopes = [{
        location: '打印室',
        points: [
            { lng: 120.028441, lat: 30.278226 },
            { lng: 120.028485, lat: 30.278236 },
            { lng: 120.028501, lat: 30.278192 },
            { lng: 120.028456, lat: 30.278181 }
        ]
    }, {
        location: '公共区域',
        points: [
            { lng: 120.028353, lat: 30.278305 },
            { lng: 120.028411, lat: 30.278317 },
            { lng: 120.028438, lat: 30.278254 },
            { lng: 120.028378, lat: 30.278240 }
        ]
    }];

    function searchPolygon(p, points) {
        var size = scope.length;
        var count = 0;
        for (var i = 0; i < size; i++) {
            var nextI = (i + 1) % size;
            var inRightSide = isInRightSide(p.lng, p.lat, points[i].lng, points[i].lat, points[nextI].lng, points[nextI].lat);
            if (!inRightSide) break;
            count++;
        }

        return count === size;
    }

    function isInRightSide(lng, lat, lngFrom, latFrom, lngTo, latTo) {
        // var temp = (lat - latFrom) * (lngTo - lngFrom) - (lng - lngFrom) * (latTo - latFrom);
        var temp = numeral(lat).subtract(latFrom).multiply(numeral(lngTo).subtract(lngFrom)).subtract(numeral(lng).subtract(lngFrom).multiply(numeral(latTo).subtract(latFrom)));
        return temp <= 0;
    }

    return {
        current: undefined,
        scopes: scopes,
        isIn: function(p) {
            if (!this.current) return false;
            return searchPolygon(p, this.current.points);
        }
    }
}]);