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
})

.filter('celsius', function() {
    return function(input) {
        return angular.isNumber(parseFloat(input)) ? input + '˚C' : '';
    };
})

.filter('percentage', function() {
    return function(input) {
        return angular.isNumber(parseInt(input)) ? input + '%' : '';
    };
})

.filter('tempLevel', function() {
    return function(input) {
        if (input <= 4) return '很冷';
        if (input <= 8) return '冷';
        if (input <= 13) return '凉';
        if (input <= 18) return '凉爽';
        if (input <= 23) return '舒适';
        if (input <= 29) return '温暖';
        if (input <= 35) return '热';
        return '炎热';
    };
})

.filter('co2Level', function() {
    return function(input) {
        if (input <= 1000) return '优';
        return '劣';
    };
})

.filter('pm25Level', function() {
    return function(input) {
        if (input <= 35) return '低';
        if (input <= 53) return '中';
        if (input <= 70) return '高';
        return '极高';
    };
});