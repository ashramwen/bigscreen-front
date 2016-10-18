'use strict';

angular.module('BigScreen.Portal')

.controller('OfficeSpaceController', ['$scope', function($scope) {

    $scope.firstRooms = [
        { location: '0807w-E', name: '工位区', type: 'work' },
        { location: '0807w-D', name: '工位区', type: 'work' },
        { location: '0807w-Y03', name: '休闲区', type: 'rest' },
        { location: '0807w-C', name: '工位区', type: 'work' },
        { location: '0807w-B', name: '工位区', type: 'work' },
        { location: '0807w-A', name: '工位区', type: 'work' },
        { location: '0807w-Y02', name: '休闲区', type: 'rest' },
        { location: '0807w-Y01', name: '休闲区', type: 'rest' }
    ];

    $scope.secondRooms = [
        { location: '0807w-Y06', name: '休闲区', type: 'rest' },
        { location: '0807w-Y05', name: '休闲区', type: 'rest' },
        { location: '0807w-Y04', name: '休闲区', type: 'rest' }
    ];
}]);