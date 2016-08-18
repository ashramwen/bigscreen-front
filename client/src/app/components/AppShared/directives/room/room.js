angular.module('BigScreen.AppShared')
  .directive('appRoom',['$timeout',function($timeout){
    return {
        restrict: 'E',
        templateUrl: 'app/components/AppShared/directives/room/room.html',
        replace: true,
        scope:{
            room: '='
        },
        link: function(scope, element, attrs){

        }
    }
  }]);