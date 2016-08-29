'use strict';

angular.module('BigScreen.AppShared')

.factory('WebSocketClient', ['$rootScope', 'SessionService', function($rootScope, SessionService) {
    var _client = {};
    var subscriptionList = [];

    var init = (function() {
        _client = Stomp.client(webSocketPath);
        var connect_callback = function(frame) {
            console.log('Connected: ' + frame);
            $rootScope.$broadcast('stomp.connected');
        };
        var error_callback = function(error) {
            console.log(error);
        };
        _client.connect({
            'Authorization': 'Bearer ' + SessionService.getPortalAdmin().accessToken
        }, connect_callback, error_callback);
        // _client.debug = angular.noop();
    })();

    return {
        isConnected: function() {
            return _client.connected || false;
        },
        subscribe: function(app, thingId, callback, headers) {
            var destination = '/topic/' + app + '/' + thingId;
            if (subscriptionList.indexOf(destination) > -1) return;
            subscriptionList.push(destination);
            var s = _client.subscribe(destination, function() {
                var args = arguments;
                args[0] = JSON.parse(args[0].body);
                $rootScope.$apply(function() {
                    callback.apply(_client, args);
                });
            }, headers);
            return s;
        },
        unsubscribeAll: function() {
            var i = 0;
            for (; i < _client.subscriptions.length; i++) {
                _client.subscriptions[i].unsubscribe();
            }
        },
        send: function(destination, headers, body) {
            _client.send(destination, headers, body);
        },
        disconnect: function(callback) {
            _client.disconnect(function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(_client, args);
                });
            });
        }
    }
}]);