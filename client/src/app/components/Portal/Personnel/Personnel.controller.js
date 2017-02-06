'use strict';

angular.module('BigScreen.Portal').controller('PersonnelController', ['$scope', '$interval', '$timeout', 'PersonnelService', 'PersonnelChart', function ($scope, $interval, $timeout, PersonnelService, PersonnelChart) {
    function routine() {
        // chart
        PersonnelChart.init(document.getElementById('personnel-chart'));
        PersonnelChart.setData().then(function (res) {
            $scope.max = res;
        });

        // latest guest
        // PersonnelService.searchByStranger().then(function (res) {
        //     $scope.strangers = [];
        //     res.hits.hits.forEach(function (o) {
        //         $scope.strangers.push({
        //             photo: o._source.object.photo,
        //             time: o._source.timestamp
        //         })
        //     });
        // });
    }
    routine();

    $scope.today = moment().format('YYYY/MM/DD');
    $scope.yesterday = moment().subtract(1, 'days').format('YYYY/MM/DD');

    $scope.$on('theMin', routine);

    // today records
    PersonnelService.getTodayRecord().then(function (res) {
        var data = getEnter(res.aggregations.beehive_user.buckets, 'todayEnter');
        $scope.todayEnter = getPersonnelInfo(data);
    });

    // yesterday records
    PersonnelService.getYesterdayRecord().then(function (res) {
        var data = getEnter(res.aggregations.beehive_user.buckets, 'todayEnter');
        $scope.yerterdayEnter = getPersonnelInfo(data);

        data = getLeave(res.aggregations.beehive_user.buckets, 'todayEnter');
        $scope.yerterdayLeave = getPersonnelInfo(data);
    });

    /**
     * get the person who entered earliest
     *
     * @param {any} buckets
     * @returns
     */
    function getEnter(buckets) {
        var row;
        for (var i = buckets.length - 1; i >= 0; i--) {
            if (buckets[i].key === 'non_beehive_user') continue;
            row = buckets[i].latest_record.hits.hits[0]._source;
            break;
        }
        return row;
    }

    /**
     * get the person who left latest
     *
     * @param {any} buckets
     * @returns
     */
    function getLeave(buckets) {
        var row;
        for (var i = 0; i < buckets.length; i++) {
            if (buckets[i].key === 'non_beehive_user') continue;
            row = buckets[i].latest_record.hits.hits[0]._source;
            break;
        }
        return row;
    }

    /**
     * get person info
     *
     * @param {any} data
     * @returns
     */
    function getPersonnelInfo(data) {
        if (!data) return;
        return {
            name: data.object.subject.name,
            photo: data.object.photo,
            time: data.timestamp
        }
    }

    // websocket: face++
    // var positions = ['east_in', 'east_out', 'south_in', 'south_out'];
    // var faceTimer;
    // var client = PersonnelService.faceplusplus(function (msg) {
    //     console.log('face++', {
    //         position: msg.screen.camera_position,
    //         name: msg.subject.name,
    //         timestamp: msg.timestamp
    //     });
    //     if (positions.indexOf(msg.screen.camera_position) < 0) return;
    //     angular.isDefined(faceTimer) && $timeout.cancel(faceTimer);
    //     $scope.coming = {
    //         name: msg.subject.name,
    //         photo: msg.photo,
    //         timestamp: msg.timestamp
    //     };
    //     faceTimer = $timeout(function () {
    //         $scope.coming = undefined;
    //     }, 60000);
    // });

    // $scope.$on('$destroy', function () {
    //     client.unsubscribeAll();
    //     if (angular.isDefined(faceTimer)) {
    //         $timeout.cancel(faceTimer);
    //         faceTimer = undefined;
    //     }
    // });
}]);