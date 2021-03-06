'use strict';

angular.module('BigScreen.Portal')

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app.Portal.Welcome', {
            url: '/Welcome',
            templateUrl: 'app/components/Portal/Welcome/Welcome.html',
            controller: 'WelcomeController',
            getName: function() {
                return 'Welcome';
            }
        })
        .state('app.Portal.OfficeSpace', {
            url: '/OfficeSpace',
            templateUrl: 'app/components/Portal/OfficeSpace/OfficeSpace.html',
            controller: 'OfficeSpaceController',
            getName: function() {
                return '办公空间总览';
            }
        })
        .state('app.Portal.Environment', {
            url: '/Environment',
            templateUrl: 'app/components/Portal/Environment/Environment.html',
            controller: 'EnvironmentController',
            getName: function() {
                return '办公环境监控';
            }
        })
        .state('app.Portal.MeetingRoom', {
            url: '/MeetingRoom',
            templateUrl: 'app/components/Portal/MeetingRoom/MeetingRoom.html',
            controller: 'MeetingRoomController',
            getName: function() {
                return '会议室';
            }
        })
        .state('app.Portal.ParkingArea', {
            url: '/ParkingArea',
            templateUrl: 'app/components/Portal/ParkingArea/ParkingArea.html',
            controller: 'ParkingAreaController',
            getName: function() {
                return '智能停车场';
            }
        })
        .state('app.Portal.Personnel', {
            url: '/Personnel',
            templateUrl: 'app/components/Portal/Personnel/Personnel.html',
            controller: 'PersonnelController',
            getName: function() {
                return '办公室人流进出高峰';
            }
        })
        .state('app.Portal.ApiUsage', {
            url: '/ApiUsage',
            templateUrl: 'app/components/Portal/ApiUsage/ApiUsage.html',
            controller: 'ApiUsageController',
            getName: function() {
                return 'IB平台集成信息';
            }
        })
        .state('app.Portal.VIP', {
            url: '/vip/:name/{id:int}',
            templateUrl: 'app/components/Portal/VIP/VIP.html',
            controller: 'VIPController',
            getName: function() {
                return '';
            },
            params: {
                id: 1
            }
        });
}]);