'use strict';

angular.module('BigScreen.Portal')

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app.Portal.Welcome', {
            url: '/Welcome',
            templateUrl: 'app/components/Portal/Welcome/Welcome.html',
            controller: 'WelcomeController',
            getName: function() {
                return 'PortalNavs.Welcome';
            }
        })
        .state('app.Portal.Environment', {
            url: '/Environment',
            templateUrl: 'app/components/Portal/Environment/Environment.html',
            controller: 'EnvironmentController',
            getName: function() {
                return 'PortalNavs.Environment';
            }
        })
        .state('app.Portal.OfficeSpace', {
            url: '/OfficeSpace',
            templateUrl: 'app/components/Portal/OfficeSpace/OfficeSpace.html',
            controller: 'OfficeSpaceController',
            getName: function() {
                return 'PortalNavs.OfficeSpace';
            }
        })
        .state('app.Portal.OfficeUsage', {
            url: '/OfficeUsage',
            templateUrl: 'app/components/Portal/OfficeUsage/OfficeUsage.html',
            controller: 'OfficeUsageController',
            getName: function() {
                return 'PortalNavs.OfficeUsage';
            }
        })
        .state('app.Portal.ParkingArea', {
            url: '/ParkingArea',
            templateUrl: 'app/components/Portal/ParkingArea/ParkingArea.html',
            controller: 'ParkingAreaController',
            getName: function() {
                return 'PortalNavs.ParkingArea';
            }
        });
}]);