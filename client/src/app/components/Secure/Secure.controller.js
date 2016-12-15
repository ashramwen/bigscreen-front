'use strict';

angular.module('BigScreen.Secure')

.controller('SecureController', ['$timeout', '$state', 'AppUtils', 'SecurityService', 'SessionService', function($timeout, $state, AppUtils, SecurityService, SessionService) {
    AppUtils.showLoading();

    SecurityService.login().then(function(portalAdmin) {
        SessionService.setPortalAdmin(portalAdmin);
        AppUtils.hideLoading();

        $timeout(function() {
            $state.go('app.Portal.OfficeSpace');
        }, 5000);
    }, function(error) {
        console.log(error);
        AppUtils.hideLoading();
    });
}]);