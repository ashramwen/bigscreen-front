'use strict';

angular.module('BigScreen.AppShared')

    .factory('ThirdPartyWsClient', ['$rootScope', '$timeout', 'SessionService', function ($rootScope, $timeout, SessionService) {
        var _client = {};
        var subscriptionList = [];
        var times = 5;

        var connect_callback = function (frame) {
            console.log('3rd STOMP Connected: ' + frame);
            $rootScope.$broadcast('3rd_stomp.connected');
        };
        var error_callback = function (error) {
            console.log('3rd STOMP ERROR:', error);
            if (times > 0) {
                $timeout(stompConnect, 5000);
                console.log('3rd STOMP: Reconnecting in 5 seconds');
                times--;
            }
        };

        function stompConnect() {
            var user = SessionService.getPortalAdmin();
            if (user) {
                _client = Stomp.client(thirdPartyWsUrl);
                _client.connect({
                    'apiKey': thirdPartyAPIKey
                }, connect_callback, error_callback);
                _client.debug = angular.noop();
            } else {
                $timeout(stompConnect, 5000);
            }
        }
        stompConnect();

        return {
            isConnected: function () {
                return _client.connected || false;
            },
            subscribe: function (url, callback, headers) {
                var destination = url;
                if (subscriptionList.indexOf(destination) > -1) return;
                subscriptionList.push(destination);
                var s = _client.subscribe(destination, function () {
                    var args = arguments;
                    args[0] = JSON.parse(args[0].body);
                    $rootScope.$apply(function () {
                        callback.apply(_client, args);
                    });
                }, headers);
                return s;
            },
            unsubscribeAll: function () {
                var i = 0;
                for (; i < _client.subscriptions.length; i++) {
                    _client.subscriptions[i].unsubscribe();
                }
            },
            send: function (destination, headers, body) {
                _client.send(destination, headers, body);
            },
            disconnect: function (callback) {
                _client.disconnect(function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(_client, args);
                    });
                });
            }
        }
    }]);