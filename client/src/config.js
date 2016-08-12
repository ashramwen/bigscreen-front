(function() {
    window.appConfig = {
        "DEV": {
            "cloudUrl": "http://api-development-beehivecn3.internal.kii.com",
            "wsUrl": "ws://114.215.196.178:8080/beehive-portal/websocket/stomp",
            "siteUrl": "http://114.215.196.178:8080/beehive-portal",
            "thirdPartyAPIUrl": "http://114.215.196.178:8081/3rdpartyapiserver/app/api_inquiry/apilist.html?vendor=Beehive"
        },
        "QA": {
            "cloudUrl": "http://api-development-beehivecn3.internal.kii.com",
            "wsUrl": "ws://114.215.178.24:8080/beehive-portal/websocket/stomp",
            "siteUrl": "http://114.215.178.24:8080/beehive-portal",
            "thirdPartyAPIUrl": "http://114.215.178.24:9081/index.html"
        },
        "LOCAL": {
            "cloudUrl": "http://api-development-beehivecn3.internal.kii.com",
            "wsUrl": "ws://localhost:9090/beehive-portal/websocket/stomp",
            "siteUrl": "http://localhost:9090/beehive-portal",
            "thirdPartyAPIUrl": "http://114.215.178.24:8081/3rdpartyapiserver/app/api_inquiry/apilist.html?vendor=Beehive"
        },
        "ENV": "DEV"
    };
})();