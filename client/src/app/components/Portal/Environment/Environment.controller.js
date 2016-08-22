'use strict';

angular.module('BigScreen.Portal')

.controller('EnvironmentController', ['$scope', 'PopulationChart', function($scope, PopulationChart) {

    $scope.init = function() {
        PopulationChart.init(document.getElementById('population-chart'));
        // PopulationChart.setData();
    }
}]);