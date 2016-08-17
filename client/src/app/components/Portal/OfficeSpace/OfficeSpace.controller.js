'use strict';

angular.module('BigScreen.Portal')

.controller('OfficeSpaceController', ['$scope', function($scope, mqttClient, sendHttpRequest) {
    $scope.firstRooms = [
        { id: 1, light: 1, fan: 1, empty: false, name: '工位区', type: 'work' },
        { id: 2, light: 1, fan: 1, empty: false, name: '工位区', type: 'work' },
        { id: 3, light: 1, fan: 1, empty: false, name: '休闲区', type: 'rest' },
        { id: 4, light: 0, fan: 0, empty: true, name: '工位区', type: 'work' },
        { id: 5, light: 1, fan: 1, empty: false, name: '工位区', type: 'work' },
        { id: 6, light: 1, fan: 1, empty: false, name: '工位区', type: 'work' },
        { id: 7, light: 1, fan: 1, empty: false, name: '休闲区', type: 'rest' },
        { id: 8, light: 1, fan: 1, empty: false, name: '休闲区', type: 'rest' }
    ];

    $scope.secondRooms = [
        { id: 9, light: 1, fan: 1, empty: false, name: '休闲区', type: 'rest' },
        { id: 10, light: 0, fan: 0, empty: true, name: '休闲区', type: 'rest' },
        { id: 11, light: 1, fan: 1, empty: false, name: '休闲区', type: 'rest' }
    ]
}]);