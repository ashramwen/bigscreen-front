'use strict';

angular.module('BigScreen.Portal')

.factory('PortalService', ['AppUtils', '$state', function(AppUtils, $state) {

    var PortalService = {};

    /**
     * get state display name
     * @param  {[type]} stateName [description]
     * @return {[type]}           [description]
     */
    PortalService.getStateDisplayName = function(stateName) {
        return $state.get(stateName).getName();
    }

    /**
     * get states chan for navigation map on portal top navigation bar
     * @param  {[type]} currentState [description]
     * @return {[type]}              [description]
     */
    PortalService.getStateChan = function(currentState) {
        var stateChan = [];
        stateChan.push(currentState);

        var statePointer = currentState;

        while (statePointer.previous) {
            statePointer = $state.get(statePointer.previous);
            stateChan.push(statePointer);
        }
        stateChan.reverse();
        return stateChan;
    };

    /**
     * if given state name is in involved state chan
     * @param  {[type]}  stateName [description]
     * @return {Boolean}           [description]
     */
    PortalService.isActive = function(stateName) {
        var stateChan = PortalService.getStateChan($state.current);
        var thisState = $state.get(stateName);
        return stateChan.indexOf(thisState) > -1;
    }

    PortalService.getPortalNavs = function() {
        return [{
            name: 'PortalNavs.Dashboard',
            state: $state.get('app.Portal.Dashboard'),
            icon: 'fa-tachometer'
        }, {
            name: 'PortalNavs.Elasticsearch',
            state: $state.get('app.Portal.Elasticsearch'),
            icon: 'fa-line-chart'
        }, {
            name: 'PortalNavs.Geo',
            state: $state.get('app.Portal.Geo'),
            icon: 'fa-globe'
        }, {
            name: 'PortalNavs.Mqtt',
            state: $state.get('app.Portal.Mqtt'),
            icon: 'fa-cogs',
            hidden: true
        }, {
            name: 'PortalNavs.Paho',
            state: $state.get('app.Portal.Paho'),
            icon: 'fa-cogs',
            hidden: true
        }, {
            name: 'PortalNavs.Websocket',
            state: $state.get('app.Portal.Websocket'),
            icon: 'fa-cogs',
            hidden: true
        }, {
            name: 'PortalNavs.Settings',
            state: $state.get('app.Portal.Settings'),
            icon: 'fa-cogs'
        }];
    }

    return PortalService;
}]);
