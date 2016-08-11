'use strict';

angular.module('BigScreen.Portal', [
    'ngResource',
    // 'BigScreen.Portal.Welcome',
    'BigScreen.AppShared'
]).config(['$resourceProvider', function($resourceProvider) {
  // Don't strip trailing slashes from calculated URLs
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
