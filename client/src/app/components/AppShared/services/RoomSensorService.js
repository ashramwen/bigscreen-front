'use strict';

angular.module('BigScreen.AppShared')

.factory('RoomSensorService', ['$rootScope', 'WebSocketClient', 'StatusDetector', function($rootScope, WebSocketClient, StatusDetector) {
    function subscribeThings(room, type) {
        room[type].forEach(function(thing) {
            if (!thing.kiiAppID || !thing.kiiThingID) return;
            WebSocketClient.subscribe(thing.kiiAppID, thing.kiiThingID, function(res) {
                // console.log(thing, res.state);
                angular.extend(thing.status, res.state);
                StatusDetector.detectSpecificType(room, type);
            });
        });
    }

    function presubscribe(room) {
        surscribeField.forEach(function(type) {
            if (!room.hasOwnProperty(type)) return;
            subscribeThings(room, type);
        });
    }

    var surscribeField = ['AirCondition', 'EnvironmentSensor', 'Lighting'];

    return function(room) {
        if (WebSocketClient.isConnected()) {
            presubscribe(room);
        } else {
            $rootScope.$on('stomp.connected', function() {
                presubscribe(room);
            })
        }
        return WebSocketClient;
    }
}]);