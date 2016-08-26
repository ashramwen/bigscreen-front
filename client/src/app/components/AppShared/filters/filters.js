'use strict';

angular.module('BigScreen.AppShared')

.filter('leftHalf', function() {
    return function(input) {
        var arr = []
        _.each(input, function(val, index) {
            if (index % 2 == 0) return;
            arr.push(val)
        });

        return arr;
    };
})

.filter('rightHalf', function() {
    return function(input) {
        var arr = []
        _.each(input, function(val, index) {
            if (index % 2 == 1) return;
            arr.push(val)
        });

        return arr;
    };
})

.filter('range', function() {
    return function(input, min, max) {
        min = parseInt(min);
        max = parseInt(max);

        for (var i = min; i < max; i++) {
            input.push(i);
        }

        return input;
    };
});