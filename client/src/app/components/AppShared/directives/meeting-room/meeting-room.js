angular.module('BigScreen.AppShared')
  .directive('appMeetingRoom',['$timeout',function($timeout){
    return {
        restrict: 'E',
        templateUrl: 'app/components/AppShared/directives/meeting-room/meeting-room.html',
        replace: true,
        scope:{
            room: '='
        },
        link: function(scope, element, attrs){

        }
    }
  }]);