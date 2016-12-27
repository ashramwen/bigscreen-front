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
            name: '办公空间总览',
            state: $state.get('app.Portal.OfficeSpace'),
            icon: 'fa-globe'
        }, {
            name: '办公环境监控',
            state: $state.get('app.Portal.Environment'),
            icon: 'fa-tachometer'
        }, {
            name: '会议室',
            state: $state.get('app.Portal.MeetingRoom'),
            icon: 'fa-th-list'
        }, {
            name: '智能停车场',
            state: $state.get('app.Portal.ParkingArea'),
            icon: 'fa-car'
        }];
    }

    return PortalService;
}]);