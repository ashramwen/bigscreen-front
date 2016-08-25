'use strict';

angular.module('BigScreen.AppShared')

.factory('StatusDetector', ['$rootScope', 'SessionService', function($rootScope, SessionService) {
    return {
        detectSpecificType: function(room, type) {
            switch (type) {
                case 'AirCondition':
                    this.detectAirCondition(room)
                    break;
                case 'EnvironmentSensor':
                    this.detectPIR(room)
                    break;
                case 'Lighting':
                    this.detectLighting(room)
                    break;
            }
        },
        detectAll: function(room) {
            this.detectLighting(room);
            this.detectAirCondition(room);
            this.detectPIR(room);
        },
        detectLighting: function(room) {
            if (!room.hasOwnProperty('Lighting')) return;
            room.light = room.light | 0;
            room['Lighting'].forEach(function(thing) {
                if (!thing.status) return;
                room.light = room.light | thing.status.Power;
            });
        },
        detectAirCondition: function(room) {
            if (!room.hasOwnProperty('AirCondition')) return;
            room.air = room.air | 0;
            room['AirCondition'].forEach(function(thing) {
                if (!thing.status) return;
                room.air = room.air | thing.status.Power;
            });
        },
        detectPIR: function(room) {
            if (!room.hasOwnProperty('EnvironmentSensor')) return;
            room.person = room.person | 0;
            room['EnvironmentSensor'].forEach(function(thing) {
                if (!thing.status) return;
                room.person = room.person | thing.status.PIR;
            });
        }
    }
}]);