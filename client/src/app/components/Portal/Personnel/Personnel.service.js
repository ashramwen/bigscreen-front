'use strict';

angular.module('BigScreen.Portal')

.factory('PersonnelService', ['$rootScope', '$q', 'ApiService', 'ThirdPartyWsClient', function ($rootScope, $q, ApiService, ThirdPartyWsClient) {
    function wsSubscribe(callback) {
        ThirdPartyWsClient.subscribe('/topic/facePlusPlus/*', function (msg) {
            callback.apply(this, [msg]);
        });
        ThirdPartyWsClient.subscribe('/topic/thirdparty/faceplusplus', function (msg) {
            callback.apply(this, [msg]);
        });
    }

    return {
        faceplusplus: function (callback) {
            if (ThirdPartyWsClient.isConnected()) {
                wsSubscribe(callback);
            } else {
                $rootScope.$on('3rd_stomp.connected', function () {
                    wsSubscribe(callback);
                })
            }
        },
        identifyFrequency: function () {
            var data = {
                startDateTime: moment().startOf('day').valueOf(), // 當前時間 0 點
                endDateTime: moment().add(1, 'days').startOf('day').valueOf(), // 次日時間 0 點,
                interval: '1h'
            };
            var dataIn = angular.extend({
                cameraPositions: ['south_in', 'east_in']
            }, data);
            var dataOut = angular.extend({
                cameraPositions: ['south_out', 'east_out']
            }, data);

            var qIn = ApiService.Personneel.identifyFrequency({}, dataIn).$promise;
            var qOut = ApiService.Personneel.identifyFrequency({}, dataOut).$promise;

            var deferred = $q.defer();
            $q.all([qIn, qOut]).then(function (res) {
                // var ret = [res[0].aggregations.byHour.buckets, res[1].aggregations.byHour.buckets];
                deferred.resolve(res);
            }, function () {
                deferred.reject();
            });
            return deferred.promise;
        },
        searchByStranger: function () {
            return ApiService.Personneel.searchByStranger({}, {
                startDateTime: moment().subtract(3, 'days').valueOf(), // 當前時間 -3 天
                endDateTime: 9999999999999,
                cameraPositions: ['south_out', 'east_out', 'south_in', 'east_in'],
                orderByTimestamp: 'desc',
                size: 3,
                from: 0
            }).$promise;
        },
        searchLatestRecord: function () {
            return ApiService.Personneel.searchLatestRecord({}, {
                startDateTime: moment().subtract(1, 'days').startOf('day').valueOf(), // 前一天 0 點
                endDateTime: moment().startOf('day').valueOf(), // 今天 0 點
                cameraPositions: ['south_out', 'east_out', 'south_in', 'east_in']
            }).$promise;
        }
    }
}]);