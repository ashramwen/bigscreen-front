'use strict';

angular.module('BigScreen.AppShared')

.factory('VIPDetector', ['$rootScope', '$q', '$interval', function($rootScope, $q, $interval) {

    var stop = $interval(function() {

    }, 10000);

    return {

    }
}]);