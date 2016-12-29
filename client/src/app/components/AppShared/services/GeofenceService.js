'use strict';

angular.module('BigScreen.AppShared')

.factory('GeofenceService', ['$rootScope', '$resource', '$q', '$interval', 'SessionService', function ($rootScope, $resource, $q, $interval, SessionService) {

    function searchPolygon(poi, current) {
        if (poi.floor !== current.floor) return false;
        var scope = current.scope;
        var size = scope.length;
        var count = 0;
        for (var i = 0; i < size; i++) {
            var nextI = (i + 1) % size;
            var inRightSide = isInRightSide(poi.lng, poi.lat, scope[i].lng, scope[i].lat, scope[nextI].lng, scope[nextI].lat);
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
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + SessionService.getPortalAdmin().accessToken,
                    'apiKey': thirdPartyAPIKey
                },
                params: {
                    userID: vip.key,
                    // startDateTime: 0,
                    startDateTime: '@startDateTime',
                    endDateTime: 9999999999999,
                    size: 1,
                    from: 0,
                    inv: 1,
                    orderByTimestamp: 'desc'
                }
            }
        });
        poi.get({
            startDateTime: (new Date().valueOf() - 30000)
        }, function (res) {
            var a = 1;
            q.resolve(parsePOI(res.hits));
        });
        // return poi.get().$promise;
        // setTimeout(function() {
        //     q.resolve({
        //         lng: 120.028456,
        //         lat: 30.278226,
        //         floor: 8
        //     });
        // }, 100);
        return q.promise;
    }

    function parsePOI(data) {
        var poi = {
            lng: 0,
            lat: 0,
            floor: 0
        };
        try {
            if (data.total === 0) return poi;
            poi.lng = data.hits[0]['_source'].object.x;
            poi.lat = data.hits[0]['_source'].object.y;
            poi.floor = data.hits[0]['_source'].object.floor;
        } catch (err) {
            console.log('poi data error.')
        }
        return poi;
    }

    function detectPOI() {
        var q = $q.defer();
        $q.all([getPOI(0), getPOI(1), getPOI(2)]).then(function (res) {
            GeofenceService.isNear = false;
            var newVip;
            vips.forEach(function (vip, i) {
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

    var scopes = [{
        location: '打印室',
        floor: 8,
        scope: [{
            lng: 120.02849,
            lat: 30.27817
        }, {
            lng: 120.028462,
            lat: 30.278243
        }, {
            lng: 120.028538,
            lat: 30.278272
        }, {
            lng: 120.028571,
            lat: 30.278195
        }]
    }, {
        location: '公共区域',
        floor: 8,
        scope: [{
            lng: 120.028391,
            lat: 30.278142
        }, {
            lng: 120.02836,
            lat: 30.278222
        }, {
            lng: 120.028519,
            lat: 30.278262
        }, {
            lng: 120.028547,
            lat: 30.278188
        }]
    }];

    var priority = -1;
    var vips = [{
        priority: 1,
        name: 'Bill',
        key: '0bea9fe760aaa85df7d953d6ab38d2e56692ddd8',
        pics: [{
            text: 'Introduction of Geofence Tech on Beehive',
            img: 'VIP_01.png'
        }, {
            text: '置业项目 x 智能楼宇平台展建',
            img: 'VIP_02.png'
        }, {
            text: '实验室大数据',
            img: 'VIP_07.png'
        }]
    }, {
        priority: 2,
        name: 'Dolf',
        key: 'a84feeebde4e496389b9161d7d64e565645b759f',
        pics: [{
            text: 'Introduction of Geofence Tech on Beehive',
            img: 'VIP_01.png'
        }, {
            text: '智能楼宇管理平台 & API Proxy Store',
            img: 'VIP_04.png'
        }, {
            text: '优惠讯息推送',
            img: 'VIP_05.png'
        }]
    }, {
        priority: 3,
        name: 'oldKim',
        key: 'a2e3a03c81aa83c5ac451b195d2f8d4b0eb37c97',
        pics: [{
            text: 'Introduction of Geofence Tech on Beehive',
            img: 'VIP_01.png'
        }, {
            text: '置业部办公室 — 实验室设备与系统集成',
            img: 'VIP_03.png'
        }, {
            text: '近期活动资讯',
            img: 'VIP_06.png'
        }]
    }];

    var stop = $interval(function () {
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
        isIn: function (poi) {
            return searchPolygon(poi, this.current);
        }
    }

    return GeofenceService;
}]);