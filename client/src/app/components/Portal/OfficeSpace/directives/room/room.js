angular.module('BigScreen.AppShared')
  .directive('appRoom',['$timeout',function($timeout){
    return {
        restrict: 'E',
        templateUrl: 'app/components/Portal/OfficeSpace/directives/room/room.html',
        replace: true,
        scope:{
            room: '='
        },
        link: function(scope, element, attrs){

        }
    }
  }]);