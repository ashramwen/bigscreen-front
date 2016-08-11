'use strict';

angular.module('BigScreen.Secure')

.controller('SecureController', ['$scope', '$rootScope', '$state', 'AppUtils', 'SecurityService', 'SessionService', function($scope, $rootScope, $state, AppUtils, SecurityService, SessionService) {
    AppUtils.showLoading();

    SecurityService.login().then(function(portalAdmin) {
        SessionService.setPortalAdmin(portalAdmin);
        $state.go('app.Portal.Welcome');
        AppUtils.hideLoading();
    }, function(error) {
        console.log(error);
        AppUtils.hideLoading();
    });
}]);