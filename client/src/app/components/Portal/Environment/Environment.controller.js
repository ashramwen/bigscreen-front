'use strict';

angular.module('BigScreen.Portal')

.controller('EnvironmentController', ['$scope', 'PopulationChart', function($scope, PopulationChart) {

    $scope.population = {
        total: 0,
        beehive: 0,
        beehive_display: 0,
        guest: 0,
        guest_display: 0
    }

    $scope.init = function() {
        PopulationChart.init(document.getElementById('population-chart')).then(function(res) {
            $scope.population = res;
        });
    }
}]);