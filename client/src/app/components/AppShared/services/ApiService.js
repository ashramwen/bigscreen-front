'use strict';

angular.module('BigScreen.Portal')

.factory('ApiService', ['SessionService', '$resource', function (SessionService, $resource) {
    var _user = SessionService.getPortalAdmin() || {};
    var _header = {
        'Authorization': 'Bearer ' + _user.accessToken,
        'apiKey': thirdPartyAPIKey
    };
    var ApiService = {
        ApiUsage: $resource(thirdPartyAPIUrl + 'dataUtilization/OpenApiCallingCount', {}, {
            query: {
                headers: _header,
                method: 'POST'
            }
        }),
        Environment: $resource(thirdPartyAPIUrl, {}, {
            getFacialIdentify: {
                url: thirdPartyAPIUrl + 'facialIdentify/aggregate',
                method: 'GET',
                headers: _header,
                params: {
                    startDateTime: '@startDateTime',
                    endDateTime: '@endDateTime'
                }
            },
            getThingsLatestStatus: {
                url: thirdPartyAPIUrl + 'dataUtilization/ThingsLatestStatusQuery',
                method: 'POST',
                headers: _header,
                params: {
                    // 'index': '493e83c9',
                    'startDateTime': '@startDateTime',
                    'endDateTime': '@endDateTime'
                }
            },
            searchHistoryStatesAggregation: {
                url: thirdPartyAPIUrl + 'dataUtilization/searchHistoryStatesAggregation',
                method: 'POST',
                headers: _header
            },
            searchThings: {
                url: thirdPartyAPIUrl + 'locationTag/searchThings',
                method: 'POST',
                headers: _header,
                transformResponse: function (data) {
                    return {
                        things: angular.fromJson(data)
                    }
                }
            },
            detectPIR: {
                url: thirdPartyAPIUrl + 'EnvironmentSensor/PIR',
                method: 'POST',
                isArray: true,
                headers: _header
            },
            getElectricMeter: {
                url: thirdPartyAPIUrl + 'ElectricMeter/Wh',
                method: 'POST',
                isArray: true,
                headers: _header
            },
            getElectricMeterP: {
                url: thirdPartyAPIUrl + 'ElectricMeter/P',
                method: 'POST',
                isArray: true,
                headers: _header,
                params: {
                    thingList: [5494, 5495, 4928, 5496, 5498, 5497]
                }
            }
        }),
        MeetingRoom: $resource(thirdPartyAPIUrl + 'dataUtilization/fetchBookListByRoomId', {}, {
            get: {
                headers: _header,
                params: {
                    sign: '@sign',
                    id: '@id'
                }
            }
        }),
        ParkingArea: $resource(thirdPartyAPIUrl, {}, {
            getCarInFrequency: {
                url: thirdPartyAPIUrl + 'dataUtilization/CarInFrequency',
                method: 'GET',
                headers: _header,
                params: {
                    startTime: '@startTime',
                    endTime: '@endTime'
                }
            },
            getCarOutFrequency: {
                url: thirdPartyAPIUrl + 'dataUtilization/CarOutFrequency',
                method: 'GET',
                headers: _header,
                params: {
                    startTime: '@startTime',
                    endTime: '@endTime'
                }
            },
            leaveAvgTime: {
                url: thirdPartyAPIUrl + 'dataUtilization/leaveAvgTime',
                method: 'POST',
                headers: _header,
                transformResponse: function (data) {
                    return {
                        time: angular.fromJson(data)
                    }
                }
            }
        }),
        Personneel: $resource(thirdPartyAPIUrl, {}, {
            identifyFrequency: {
                url: thirdPartyAPIUrl + 'facialIdentify/identifyFrequency',
                method: 'POST',
                headers: _header
            },
            searchByStranger: {
                url: thirdPartyAPIUrl + 'facialIdentify/searchByStranger',
                method: 'POST',
                headers: _header
            },
            searchLatestRecord: {
                url: thirdPartyAPIUrl + 'facialIdentify/searchLatestRecord',
                method: 'POST',
                headers: _header
            }
        }),
        POI: $resource(thirdPartyAPIUrl, {}, {
            get: {
                url: thirdPartyAPIUrl + 'locationGeo/searchUser',
                method: 'POST',
                headers: _header,
                params: {
                    userID: '@userID',
                    // startDateTime: 0,
                    startDateTime: '@startDateTime',
                    endDateTime: 9999999999999,
                    size: 1,
                    from: 0,
                    inv: 1,
                    orderByTimestamp: 'desc'
                }
            }
        })
    };
    return ApiService;
}]);