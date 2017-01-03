'use strict';

angular.module('BigScreen.Portal')

.controller('ApiUsageController', ['$scope', '$interval', 'ApiService', function ($scope, $interval, ApiService) {
    $scope.apis = ['POI点位采集', 'BigScreen', '人来灯开/人走灯灭', '红绿灯', '新风自动调节', '工位预定App'];

    function init() {
        ApiService.ApiUsage.query({}, {
            'startDateTime': moment().startOf('month').valueOf(),
            'endDateTime': 9999999999999,
            'orderByCount': 'desc',
            'groupBy': 'apiname'
        }).$promise.then(function (res) {
            $scope.apiUsage = res.aggregations.callingCount.buckets.slice(0, 5);
        });
    }

    init();

    var stop = $interval(function () {
        init();
    }, 60000);
}]);