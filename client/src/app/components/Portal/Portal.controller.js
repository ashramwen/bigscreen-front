'use strict';

angular.module('BigScreen.Portal')

.controller('PortalController', ['$scope', '$rootScope', '$state', 'AppUtils', 'PortalService', 'SessionService', '$interval', 'WebSocketClient', 'GeofenceService', function($scope, $rootScope, $state, AppUtils, PortalService, SessionService, $interval, WebSocketClient, GeofenceService) {
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
    // $scope.rotation = true;

    checkState();

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
        $scope.isOpen = false;
        $state.go(!nav.state.abstract ? nav.state.name : nav.state.redirectTo, $state.params);
    }

    var onehr = 3600000;
    // onehr = 10000;
    $interval(function() {
        $scope.time = moment().startOf('minute').valueOf();
        $rootScope.$broadcast('theMin', moment($scope.time));
        if ($scope.time % onehr === 0)
            $rootScope.$broadcast('theHour');
        rotateState();
    }, 60000);

    function rotateState() {
        if (!$scope.rotation) return;
        var i = 0,
            length = $scope.portalNavs.length;
        for (; i < length; i++) {
            if (!$scope.portalNavs[i].isActive) continue;
            if (i < length - 1) {
                $state.go($scope.portalNavs[i + 1].state.name);
            } else {
                $state.go($scope.portalNavs[0].state.name);
            }
            return;
        }
    }

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
        checkState();
    });

    function checkState() {
        var nav;
        for (var i = 0, length = $scope.portalNavs.length; i < length; i++) {
            nav = $scope.portalNavs[i];
            nav.isActive = (nav.state.name == $state.current.name);
        }
        $scope.current = $state.current;
    }

    $scope.$on('stomp.connected', function() {
        // WebSocketClient.subscribe('/topic/192b49ce/th.f83120e36100-bada-6e11-b056-0951136c', function(res) {

        // });
        // WebSocketClient.subscribe('/topic/192b49ce/th.aba700e36100-72a9-6e11-b056-04db935c', function(res) {

        // });
    });

    GeofenceService.current = GeofenceService.scopes[0];
    console.log(GeofenceService.isIn(120.028456, 30.278226));
}]);