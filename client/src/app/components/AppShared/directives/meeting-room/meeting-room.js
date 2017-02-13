angular.module('BigScreen.AppShared')

    .directive('appMeetingRoom', ['$interval', 'ApiService', 'RoomSensorService', function ($interval, ApiService, RoomSensorService) {
        return {
            restrict: 'E',
            templateUrl: 'app/components/AppShared/directives/meeting-room/meeting-room.html',
            replace: true,
            scope: {
                room: '='
            },
            link: function (scope, element, attrs) {
                function detectRoomStatus(time) {
                    if (!scope.room.bookInfoList) return;
                    scope.room.busy = false;
                    scope.room.bookInfoList.forEach(function (info) {
                        if (!time.isBetween(info.startTime, info.endTime)) return;
                        scope.room.busy = true;
                        return true;
                    });
                }

                var unnecessaryStates = ['PIR'];
                scope.bookingMode = true;
                var stop = $interval(function () {
                    scope.bookingMode = !scope.bookingMode;
                }, 10000);

                RoomSensorService.run(scope.room, true);
                scope.room.bookInfoList = [];
                ApiService.MeetingRoom.get({
                    id: scope.room.id,
                    sign: scope.room.sign
                }).$promise.then(function (res) {
                    if (!res.success) return;
                    var s, e;
                    res.content.bookInfoList.forEach(function (info, i) {
                        s = moment(info.startTime);
                        e = moment(info.endTime);
                        scope.room.bookInfoList.push({
                            startTime: s,
                            endTime: e,
                            start: s.format('H:mm'),
                            end: e.format('H:mm')
                        })
                    });
                    detectRoomStatus(moment());
                });
                scope.hasSchema = function (key) {
                    return scope.room.things.EnvironmentSensor[0].schema &&
                        !unnecessaryStates.includes(key) &&
                        scope.room.things.EnvironmentSensor[0].schema.hasOwnProperty(key);
                }
                scope.getName = function (key) {
                    return scope.room.things.EnvironmentSensor[0].schema[key].displayNameCN;
                }
                scope.hasWarn = function (key) {
                    return (scope.room.conditions.findIndex(function (o) {
                        return o.state === key;
                    }) >= 0);
                }
                scope.$on('theMin', function (e, time) {
                    detectRoomStatus(time);
                });
                scope.$on('$destroy', function () {
                    $interval.cancel(stop);
                    stop = undefined;
                    RoomSensorService.stop(scope.room);
                });
            }
        }
    }]);