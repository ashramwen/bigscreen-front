'use strict';

angular.module('BigScreen.Portal')

.controller('OfficeSpaceController', ['$scope', '$$Location', 'WebSocketClient', function($scope, $$Location, WebSocketClient) {

    var surscribeField = ['AirCondition', 'EnvironmentSensor', 'Lighting'];

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
        $$Location.getAllThingsByLocation({ location: room.location }).$promise.then(function(res) {
            res.forEach(function(thing, i) {
                if (!room.hasOwnProperty(thing.type))
                    room[thing.type] = [];
                room[thing.type].push(thing);
            });
            detectSensor(room);
            presubscribe(room);
        });
    })

    function presubscribe(room) {
        surscribeField.forEach(function(type) {
            if (!room.hasOwnProperty(type)) return;
            subscribeThings(room, type);
        });
    }

    function subscribeThings(room, type) {
        room[type].forEach(function(thing) {
            if (!thing.kiiAppID || !thing.kiiThingID) return;
            WebSocketClient.subscribe(thing.kiiAppID, thing.kiiThingID, function(res) {
                // console.log(thing, res.state);
                angular.extend(thing.status, res.state);
                switch (thing.type) {
                    case 'AirCondition':
                        detectAirCondition(room)
                        break;
                    case 'EnvironmentSensor':
                        detectPIR(room)
                        break;
                    case 'Lighting':
                        detectLighting(room)
                        break;
                }
            });
        });
    }

    function detectSensor(room) {
        detectLighting(room);
        detectAirCondition(room);
        detectPIR(room);
    }

    function detectLighting(room) {
        if (!room.hasOwnProperty('Lighting')) return;
        room.light = room.light | 0;
        room['Lighting'].forEach(function(thing) {
            if (!thing.status) return;
            room.light = room.light | thing.status.Power;
        });
    }

    function detectAirCondition(room) {
        if (!room.hasOwnProperty('AirCondition')) return;
        room.air = room.air | 0;
        room['AirCondition'].forEach(function(thing) {
            if (!thing.status) return;
            room.air = room.air | thing.status.Power;
        });
    }

    function detectPIR(room) {
        if (!room.hasOwnProperty('EnvironmentSensor')) return;
        room.person = room.person | 0;
        room['EnvironmentSensor'].forEach(function(thing) {
            if (!thing.status) return;
            room.person = room.person | thing.status.PIR;
        });
    }

    function subscription(room, message) {

    }

    $scope.$on('$destroy', function() {
        WebSocketClient.unsubscribeAll();
    });
}]);