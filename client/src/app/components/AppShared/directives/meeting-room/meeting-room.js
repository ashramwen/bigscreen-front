angular.module('BigScreen.AppShared')

.directive('appMeetingRoom', ['BookingService', function(BookingService) {
    return {
        restrict: 'E',
        templateUrl: 'app/components/AppShared/directives/meeting-room/meeting-room.html',
        replace: true,
        scope: {
            room: '='
        },
        link: function(scope, element, attrs) {
            function checkRoom(time) {
                if (!scope.room.bookInfoList) return;
                scope.room.busy = false;
                scope.room.bookInfoList.forEach(function(info) {
                    if (!time.isBetween(info.startTime, info.endTime)) return;
                    scope.room.busy = true;
                    return true;
                });
            }
            scope.room.bookInfoList = [];
            BookingService.get({ id: scope.room.id, sign: scope.room.sign }).$promise.then(function(res) {
                if (!res.success) return;
                var s, e;
                res.content.bookInfoList.forEach(function(info, i) {
                    s = moment(info.startTime);
                    e = moment(info.endTime);
                    scope.room.bookInfoList.push({
                        startTime: s,
                        endTime: e,
                        start: s.format('H:mm'),
                        end: e.format('H:mm')
                    })
                });
                checkRoom(moment());
            });
            scope.$on('theMin', function(e, time) {
                checkRoom(time);
            });
        }
    }
}]);