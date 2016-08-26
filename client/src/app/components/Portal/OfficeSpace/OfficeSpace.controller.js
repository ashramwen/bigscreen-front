'use strict';

angular.module('BigScreen.Portal')

.controller('OfficeSpaceController', ['$scope', 'WebSocketClient', 'RoomSensorService', function($scope, WebSocketClient, RoomSensorService) {

    $scope.firstRooms = [
        { location: '0807w-W05', name: '工位区', type: 'work' },
        { location: '0807w-W04', name: '工位区', type: 'work' },
        { location: '0807w-F03', name: '休闲区', type: 'rest' },
        { location: '0807w-W03', name: '工位区', type: 'work' },
        { location: '0807w-W02', name: '工位区', type: 'work' },
        { location: '0807w-W01', name: '工位区', type: 'work' },
        { location: '0807w-F02', name: '休闲区', type: 'rest' },
        { location: '0807w-F01', name: '休闲区', type: 'rest' }
    ];

    $scope.secondRooms = [
        { location: '0807w-F06', name: '休闲区', type: 'rest' },
        { location: '0807w-F05', name: '休闲区', type: 'rest' },
        { location: '0807w-F04', name: '休闲区', type: 'rest' }
    ];

    $scope.firstRooms.forEach(function(room, i) {
        RoomSensorService(room);
    })

    $scope.secondRooms.forEach(function(room, i) {
        RoomSensorService(room);
    })

    $scope.$on('$destroy', function() {
        WebSocketClient.unsubscribeAll();
    });
}]);