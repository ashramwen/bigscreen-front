'use strict';

angular.module('BigScreen.AppShared')

    .factory('RoomSensorService', ['$rootScope', '$$Location', '$$Schema', 'WebSocketClient', 'StatusDetector', function ($rootScope, $$Location, $$Schema, WebSocketClient, StatusDetector) {
        var surscribeField = ['FreshAir', 'EnvironmentSensor', 'Lighting'];

        function subscribeThings(room, type) {
            var subscription;
            room.things[type].forEach(function (thing) {
                if (!thing.kiiAppID || !thing.kiiThingID) return;
                subscription = WebSocketClient.subscribe(thing.kiiAppID, thing.kiiThingID, function (res) {
                    angular.extend(thing.status, res.state);
                    StatusDetector.detectSpecificType(room, type);
                });
                subscription && room.subscriptions.push(subscription);
            });
        }

        function presubscribe(room, monitoring) {
            surscribeField.forEach(function (type) {
                if (!room.things.hasOwnProperty(type)) return;
                subscribeThings(room, type);

                // monitor the first EnvironmentSensor
                if (monitoring && type === 'EnvironmentSensor' && !room.monitoring) {
                    var thing = room.things.EnvironmentSensor[0];
                    $$Schema.getByType({
                        thingType: thing.type,
                        name: thing.schemaName,
                        version: thing.schemaVersion
                    }).$promise.then(function (res) {
                        thing.schema = res.content.statesSchema.properties;
                        detectCondition(room, thing);
                        var subs = WebSocketClient.subscribe(thing.kiiAppID, thing.kiiThingID, function (res) {
                            thing.status = res.state;
                            detectCondition(room, thing);
                        });
                        room.subscriptions.push(subs);
                    })
                    room.monitoring = true;
                }
            });
        }
        var rules = [{
            state: 'CO2',
            condition: 100,
            express: '>',
            desc: '新风已自动开启'
        }, {
            state: 'Temp',
            condition: 18,
            express: '<',
            desc: '空调已自动开启'
        }, {
            state: 'Temp',
            condition: 30,
            express: '>',
            desc: '空调已自动开启'
        }];

        function genCondition(thing, rule) {
            var condition = angular.copy(rule);
            condition.name = thing.schema[rule.state].displayNameCN;
            return condition;
        }

        function detectCondition(room, thing) {
            var conditions = [];
            rules.forEach(function (rule) {
                if (!thing.status.hasOwnProperty(rule.state)) return;
                switch (rule.express) {
                    case '>':
                        if (thing.status[rule.state] < rule.condition) return;
                        break;
                    case '<':
                        if (thing.status[rule.state] > rule.condition) return;
                        break;
                }
                conditions.push(genCondition(thing, rule));
            });
            if (conditions.length > 0)
                room.conditions = conditions;
        }

        return {
            run: function (room, monitoring) {
                if (!room.things) room.things = {};
                room.subscriptions = [];
                $$Location.getAllThingsByLocation({
                    location: room.location
                }).$promise.then(function (res) {
                    res.forEach(function (thing, i) {
                        if (!room.things.hasOwnProperty(thing.type))
                            room.things[thing.type] = [];
                        room.things[thing.type].push(thing);
                    });
                    StatusDetector.detectAll(room);

                    if (WebSocketClient.isConnected()) {
                        presubscribe(room, monitoring);
                    } else {
                        $rootScope.$on('stomp.connected', function () {
                            presubscribe(room, monitoring);
                        })
                    }
                });
            },
            stop: function (room) {
                room.subscriptions.forEach(function (subscription) {
                    subscription.unsubscribe();
                });
            }
        }
    }]);