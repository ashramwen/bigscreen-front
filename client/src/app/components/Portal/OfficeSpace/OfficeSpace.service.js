'use strict';

angular.module('BigScreen.Portal')

.factory('ThingService', ['$$Location', '$q', function($$Location, $q) {
    return function() {
        var deferred = $q.defer();
        $q.all([qIn().$promise, qOut().$promise]).then(function(res) {
            var ret = [res[0].aggregations.byHour.buckets, res[1].aggregations.byHour.buckets];
            deferred.resolve(ret);
        }, function() {
            deferred.reject();
        });
        return deferred.promise;
    };
}]);