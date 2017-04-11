(function () {
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
        'PROD': {
            'cloudUrl': 'https://api-beehivecn4.kii.com',
            'wsUrl': 'ws://120.77.83.143:8080/beehive-portal/websocket/stomp',
            'siteUrl': 'http://120.77.83.143:8080/beehive-portal',
            'thirdPartyAPIUrl': 'http://120.77.83.143:8081/3rdpartyapiserver/api/',
            'thirdPartyWsUrl': 'ws://120.77.83.143:8081/3rdpartyapiserver/websocket/stomp',
            'thirdPartyAPIKey': '0e2405c81d7016c144d03f784e63235d4189d706'
        },
        'ENV': 'QA'
    };
})();