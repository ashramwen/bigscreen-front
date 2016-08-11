angular.module('BigScreen.Secure')

.factory('SecurityService', ['localStorageService', 'AppUtils', 'SessionService', '$$Auth', function(localStorageService, AppUtils, SessionService, $$Auth) {
    var SecurityService = {};

    function Status() {
        this.unauthorized = false;
    }

    SecurityService.errorHandler = function(error) {
        var status = new Status();

        switch (error.status) {
            case 'Unauthorized':
                status.unauthorized = true;
                break;
        }

        return status;
    };

    SecurityService.login = function(credentials) {
        return $$Auth.login({
            password: '1qaz2wsx',
            permanentToken: true,
            userName: 'beehive_admin'
        }).$promise;
    };

    return SecurityService;
}]);