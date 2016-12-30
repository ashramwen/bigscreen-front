angular.module('BigScreen.AppShared')

.directive('appRoom', ['RoomSensorService', function(RoomSensorService) {
    return {
        restrict: 'E',
        templateUrl: 'app/components/AppShared/directives/room/room.html',
        replace: true,
        scope: {
            room: '='
        },
        link: function(scope, element, attrs) {
            RoomSensorService.run(scope.room);
            scope.$on('$destroy', function() {
                RoomSensorService.stop(scope.room);
            });
        }
    }
}]);