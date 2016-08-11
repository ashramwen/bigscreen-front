'use strict';

angular.module('BigScreen.Portal')

.controller('OfficeSpaceController', ['$scope', function($scope, mqttClient, sendHttpRequest) {
    $scope.firstRooms = [
        { id: 1, light: 1, fan: 1, empty: false },
        { id: 2, light: 1, fan: 1, empty: false },
        { id: 3, light: 1, fan: 1, empty: false },
        { id: 4, light: 1, fan: 1, empty: false },
        { id: 5, light: 1, fan: 1, empty: false },
        { id: 6, light: 1, fan: 1, empty: false },
        { id: 7, light: 1, fan: 1, empty: false },
        { id: 8, light: 1, fan: 1, empty: false }
    ];

    $scope.secondRooms = [
        { id: 1, light: 1, fan: 1, empty: false },
        { id: 2, light: 1, fan: 1, empty: false },
        { id: 3, light: 1, fan: 1, empty: false },
        { id: 4, light: 1, fan: 1, empty: false },
        { id: 5, light: 1, fan: 1, empty: false },
        { id: 6, light: 1, fan: 1, empty: false },
        { id: 7, light: 1, fan: 1, empty: false, off: true },
        { id: 8, light: 1, fan: 1, empty: false }
    ]
}]);