'use strict';

angular.module('BigScreen.Portal', [
    'ngResource',
    // 'BigScreen.Portal.Welcome',
    'BigScreen.AppShared'
])

.constant('VIP', {
    'BILL': '0bea9fe760aaa85df7d953d6ab38d2e56692ddd8',
    'Dolf': 'a84feeebde4e496389b9161d7d64e565645b759f',
    'oldKim': 'a2e3a03c81aa83c5ac451b195d2f8d4b0eb37c97'
})

.config(['$resourceProvider', function($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);