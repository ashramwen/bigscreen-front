'use strict';

angular.module('BigScreen.Portal')

.controller('PortalController', ['$scope', '$rootScope', '$state', 'AppUtils', 'PortalService', 'SessionService', '$interval', function($scope, $rootScope, $state, AppUtils, PortalService, SessionService, $interval) {
    var userInfo = SessionService.getPortalAdmin();
    if (!userInfo) {
        $state.go('app.Secure');
    }

    $scope.portalNavs = PortalService.getPortalNavs();
    $scope.getStateChan = PortalService.getStateChan;
    $scope.getStateDisplayName = PortalService.getStateDisplayName;
    $scope.isActive = PortalService.isActive;

    $scope.time = new Date();
    $scope.current = $state.current;

    $scope.menuOff = false;

    /**
     * turn offer left side menu bar
     * @return {[type]} [description]
     */
    $scope.turnOffMenu = function() {
        $scope.menuOff = true;
    };

    /**
     * turn on left side menu bar
     * @return {[type]} [description]
     */
    $scope.turnOnMenu = function() {
        $scope.menuOff = false;
    };

    /**
     * toggle the left side menu bar
     * @return {[type]} [description]
     */
    $scope.toggleMenu = function() {
        $scope.menuOff = !$scope.menuOff;
    };

    $scope.getName = function() {

    }

    $scope.changeNav = function(nav) {
        $state.go(!nav.state.abstract ? nav.state.name : nav.state.redirectTo, $state.params);
    }

    var onehr = 3600000;
    onehr = 10000;
    $interval(function() {
        $scope.time = moment().startOf('minute').valueOf();
        if ($scope.time % onehr === 0)
            $rootScope.$broadcast('theHour');
    }, 60000);

    // $interval(function() {
    //     // $scope.time = new Date();
    // }, 10000);

    /**
     * watch portal nav changes
     * @param  {[type]} true      [description]
     * @return {[type]}           [description]
     */
    $rootScope.$watch('portalNavs', function(newVal) {
        if (!newVal || newVal.length == 0) {
            $scope.turnOnMenu();
        } else {
            $scope.turnOffMenu();
        }
    }, true);

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options) {
        var nav;
        for (var i = 0, length = $scope.portalNavs.length; i < length; i++) {
            nav = $scope.portalNavs[i];
            nav.isActive = (nav.state.name == $state.current.name);
        }
        $scope.current = $state.current;
    });
}]);