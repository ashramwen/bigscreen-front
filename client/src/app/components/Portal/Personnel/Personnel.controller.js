'use strict';

angular.module('BigScreen.Portal')

.controller('PersonnelController', ['$scope', '$interval', 'PersonnelService', function ($scope, $interval, PersonnelService) {
    function init() {
        PersonnelService.identifyFrequency().then(function (res) {});

        PersonnelService.searchByStranger().then(function (res) {
            $scope.strangers = [];
            res.hits.hits.forEach(function (o) {
                $scope.strangers.push({
                    photo: o._source.object.photo,
                    time: o._source.timestamp
                })
            });
        });

        PersonnelService.searchLatestRecord().then(function (res) {
            $scope.latestRecords = [];
            res.aggregations.beehive_user.buckets.every(function (o) {
                if (o.key === 'non_beehive_user') return true;
                var _source = o.latest_record.hits.hits[0]._source;
                $scope.latestRecords.push({
                    name: _source.object.subject.name,
                    photo: _source.object.photo,
                    time: _source.timestamp
                })
                if ($scope.latestRecords.length === 3) return false;
                return true;
            });
        });
    }
    init();

    var stop = $interval(function () {
        init();
    }, 60000);

    PersonnelService.faceplusplus(function (msg) {
        console.log(msg);
        // if (msg.screen.camera.camera_position.indexOf('in') < 0) return;
        $scope.coming = {
            name: msg.subject.name,
            photo: msg.photo
        };
    });

    $scope.$on('$destroy', function () {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    });
}]);