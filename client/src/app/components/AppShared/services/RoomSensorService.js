'use strict';

angular.module('BigScreen.AppShared')

.factory('RoomSensorService', ['$rootScope', '$$Location', 'WebSocketClient', 'StatusDetector', function($rootScope, $$Location, WebSocketClient, StatusDetector) {
    function subscribeThings(room, type) {
        room.things[type].forEach(function(thing) {
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
            if (!room.things.hasOwnProperty(type)) return;
            subscribeThings(room, type);
        });
    }

    var surscribeField = ['AirCondition', 'EnvironmentSensor', 'Lighting'];

    return function(room) {
        if (!room.things) room.things = {};
        $$Location.getAllThingsByLocation({ location: room.location }).$promise.then(function(res) {
            res.forEach(function(thing, i) {
                if (!room.things.hasOwnProperty(thing.type))
                    room.things[thing.type] = [];
                room.things[thing.type].push(thing);
            });
            StatusDetector.detectAll(room);

            if (WebSocketClient.isConnected()) {
                presubscribe(room);
            } else {
                $rootScope.$on('stomp.connected', function() {
                    presubscribe(room);
                })
            }
        });

        return WebSocketClient;
    }
}]);