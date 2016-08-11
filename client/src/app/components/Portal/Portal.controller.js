'use strict';

angular.module('BigScreen.Portal')

.controller('PortalController', ['$scope', '$rootScope', '$state', 'AppUtils', 'PortalService', 'SessionService', '$uibModal', function($scope, $rootScope, $state, AppUtils, PortalService, SessionService, $uibModal) {
    var userInfo = SessionService.getPortalAdmin();
    if (!userInfo) {
        $state.go('app.Secure');
    }

    $scope.portalNavs = PortalService.getPortalNavs();
    $scope.getStateChan = PortalService.getStateChan;
    $scope.getStateDisplayName = PortalService.getStateDisplayName;
    $scope.isActive = PortalService.isActive;

    $scope.menuOff = false;

    $scope.showReloginModal = function() {
        var modelInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app.Portal.ReLoginModal',
            controller: 'app.Portal.ReloginController',
            size: 'md',
            windowClass: 'blank-modal-content',
            backdrop: 'static'
        });

        modelInstance.result.then(function() {
            $state.reload();
        }, function() {
            $state.go('app.Secure');
        });

    };

    $scope.logout = function() {
        SessionService.expire();
        $state.go('app.Secure');
    };

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
}])

.controller('app.Portal.ReloginController', ['$scope', '$uibModalInstance', 'SecurityService', 'SessionService', function($scope, $uibModalInstance, SecurityService, SessionService) {
    $scope.errors = [{
        statusName: 'unauthorized',
        message: 'User name or password is invalid, please check again!'
    }];

    $scope.login = function(credentials) {
        AppUtils.showLoading();

        SecurityService.login(credentials).then(function(portalAdmin) {
            SessionService.setPortalAdmin(portalAdmin);
            AppUtils.hideLoading();
            $uibModalInstance.close();
        }, function(error) {
            $scope.status = SecurityService.errorHandler(error);
            AppUtils.hideLoading();
            $scope.$apply();
        });
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}]);
