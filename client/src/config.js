(function() {
    window.appConfig = {
        'DEV': {
            'cloudUrl': 'http://api-development-beehivecn3.internal.kii.com',
            'wsUrl': 'ws://114.215.196.178:8080/beehive-portal/websocket/stomp',
            'siteUrl': 'http://114.215.196.178:8080/beehive-portal',
            'thirdPartyAPIUrl': 'http://api.openibplatform.com/beehive/',
            'thirdPartyWsUrl': 'ws://114.215.178.24:8081/3rdpartyapiserver/websocket/stomp',
            'thirdPartyAPIKey': '138ef89effc5be05830170266763dbba8ac0be0f'
        },
        'QA': {
            'cloudUrl': 'http://api-development-beehivecn3.internal.kii.com',
            'wsUrl': 'ws://114.215.178.24:8080/beehive-portal/websocket/stomp',
            'siteUrl': 'http://114.215.178.24:8080/beehive-portal',
            'thirdPartyAPIUrl': 'http://api.openibplatform.com/beehive/',
            'thirdPartyWsUrl': 'ws://114.215.178.24:8081/3rdpartyapiserver/websocket/stomp',
            'thirdPartyAPIKey': '138ef89effc5be05830170266763dbba8ac0be0f'
        },
        'ENV': 'QA'
    };
})();