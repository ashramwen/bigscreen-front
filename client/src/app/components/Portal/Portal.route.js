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
        });
}]);
