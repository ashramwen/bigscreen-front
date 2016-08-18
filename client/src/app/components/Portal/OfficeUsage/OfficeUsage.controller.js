'use strict';

angular.module('BigScreen.Portal')

.controller('OfficeUsageController', ['$scope', function($scope, mqttClient, sendHttpRequest) {
    /*
    会议中
    空闲中

    预订
    今日已满
    */
    $scope.rooms = [{
        id: '8-7-11-N',
        name: '十里亭',
        busy: 1
    }, {
        id: '8-7-13-N',
        name: '幽篁阁'
    }, {
        id: '8-7-12-N',
        name: '文昌阁',
        busy: 1
    }, {
        id: '8-7-15-N',
        name: '勿幕阁',
        busy: 1
    }, {
        id: '8-7-14-N',
        name: '安定阁'
    }, {
        id: '8-7-16-N',
        name: '安远阁'
    }, {
        id: '8-7-17-N',
        name: '尚检阁',
        busy: 1
    }]
}]);