'use strict';

angular.module('BigScreen.Portal')

.controller('PortalController', ['$scope', '$rootScope', '$state', 'AppUtils', 'PortalService', 'SessionService', '$interval', 'WebSocketClient', 'GeofenceService',

    function($scope, $rootScope, $state, AppUtils, PortalService, SessionService, $interval, WebSocketClient, GeofenceService) {
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

        $scope.Geofence = GeofenceService;

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

        var oneHr = 3600000;
        // oneHr = 10000;
        var stop = $interval(function() {
            $scope.time = moment().startOf('minute').valueOf();
            $rootScope.$broadcast('theMin', moment($scope.time));
            if ($scope.time % oneHr === 0)
                $rootScope.$broadcast('theHour');
            rotateState();
        }, 60000);

        function rotateState() {
            if (!GeofenceService.rotative) return;
            var i = 0,
                length = $scope.portalNavs.length;
            for (; i < length; i++) {
                if (!$scope.portalNavs[i].isActive) continue;
                $state.go($scope.portalNavs[(i + 1) % length].state.name);
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

        $rootScope.$on('new VIP', function(e, vip) {
            // $state.go('app.Portal.VIP', { name: vip, id: 1 });
        });

        $scope.$on('$destroy', function() {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
        });
    }
]);