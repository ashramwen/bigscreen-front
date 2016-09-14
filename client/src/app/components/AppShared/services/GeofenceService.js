'use strict';

angular.module('BigScreen.AppShared')

.factory('GeofenceService', ['$rootScope', '$resource', '$q', '$interval', function($rootScope, $resource, $q, $interval) {

    function searchPolygon(lng, lat, scope) {
        var size = scope.length;
        var count = 0;
        for (var i = 0; i < size; i++) {
            var nextI = (i + 1) % size;
            var inRightSide = isInRightSide(lng, lat, scope[i].lng, scope[i].lat, scope[nextI].lng, scope[nextI].lat);
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

    function getPOI(i) {
        var vip = vips[i];
        var q = $q.defer();
        var poi = $resource(thirdPartyAPIUrl, {}, {
            get: {
                url: thirdPartyAPIUrl + 'locationGeo/searchUser',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer super_token',
                    'apiKey': thirdPartyAPIKey
                },
                params: {
                    userID: vip.key,
                    startDateTime: 0,
                    endDateTime: 9999999999999,
                    size: 50,
                    from: 0,
                    inv: 1
                }
            }
        });
        // return poi.get().$promise;
        setTimeout(function() {
            q.resolve({
                lng: 120.028456,
                lat: 30.278226
            });
        }, 100);
        return q.promise;
    }

    function detectPOI() {
        var q = $q.defer();
        $q.all([getPOI(0), getPOI(1), getPOI(2)]).then(function(res) {
            GeofenceService.isNear = false;
            var newVip;
            vips.forEach(function(vip, i) {
                vip.isIn = GeofenceService.isIn(res[i]);
                GeofenceService.isNear = GeofenceService.isNear || vip.isIn;
                if (vip.isIn && !newVip)
                    newVip = vip;
            });
            if (GeofenceService.isNear) {
                if (!GeofenceService.vip || newVip.priority < GeofenceService.vip.priority) {
                    GeofenceService.vip = newVip;
                    $rootScope.$broadcast('new VIP', GeofenceService.vip.name);
                }
            } else {
                GeofenceService.vip = undefined;
            }
            q.resolve();
        });
        return q.promise;
    }

    function detectVIP(i, poi) {
        var vip = vips[i];
        // if (!poi.hits.total) return false;
        GeofenceService.isNear = GeofenceService.isIn(poi);
        if (GeofenceService.isNear && GeofenceService.vip !== vip.name) {
            console.log(vip.name);
            GeofenceService.vip = vip;
            $rootScope.$broadcast('new VIP', GeofenceService.vip.name);
            return true;
        }
        return false;
    }

    var scopes = [{
        location: '打印室',
        scope: [
            { lng: 120.028441, lat: 30.278226 },
            { lng: 120.028485, lat: 30.278236 },
            { lng: 120.028501, lat: 30.278192 },
            { lng: 120.028456, lat: 30.278181 }
        ]
    }, {
        location: '公共区域',
        scope: [
            { lng: 120.028353, lat: 30.278305 },
            { lng: 120.028411, lat: 30.278317 },
            { lng: 120.028438, lat: 30.278254 },
            { lng: 120.028378, lat: 30.278240 }
        ]
    }];

    var priority = -1;
    var vips = [{
        priority: 1,
        name: 'Bill',
        key: '0bea9fe760aaa85df7d953d6ab38d2e56692ddd8',
        pics: [
            { text: 'Intro of Geofence Tech on Beehive', img: 'VIP_01.png' },
            { text: '置业项目 x 智能楼宇平台展建', img: 'VIP_02.png' },
            { text: '置业部办公室 — 实验室设备与系统集成', img: 'VIP_03.png' },
            { text: '智能楼宇管理平台 & API Proxy Store', img: 'VIP_04.png' }
        ]
    }, {
        priority: 2,
        name: 'Dolf',
        key: 'a84feeebde4e496389b9161d7d64e565645b759f',
        pics: [
            { text: 'Intro of Geofence Tech on Beehive', img: 'VIP_01.png' },
            { text: '置业项目 x 智能楼宇平台展建', img: 'VIP_02.png' },
            { text: '置业部办公室 — 实验室设备与系统集成', img: 'VIP_03.png' },
            { text: '智能楼宇管理平台 & API Proxy Store', img: 'VIP_04.png' }
        ]
    }, {
        priority: 3,
        name: 'oldKim',
        key: 'a2e3a03c81aa83c5ac451b195d2f8d4b0eb37c97',
        pics: [
            { text: 'Intro of Geofence Tech on Beehive', img: 'VIP_01.png' },
            { text: '置业项目 x 智能楼宇平台展建', img: 'VIP_02.png' },
            { text: '置业部办公室 — 实验室设备与系统集成', img: 'VIP_03.png' },
            { text: '智能楼宇管理平台 & API Proxy Store', img: 'VIP_04.png' }
        ]
    }];

    var stop = $interval(function() {
        if (!GeofenceService.current) return;
        detectPOI();
    }, 10000);

    var GeofenceService = {
        rotative: true,
        isNear: false,
        vip: undefined,
        current: undefined,
        last: undefined,
        scopes: scopes,
        isIn: function(poi) {
            if (!this.current) return false;
            return searchPolygon(poi.lng, poi.lat, this.current.scope);
        }
    }

    return GeofenceService;
}]);