'use strict';

angular.module('BigScreen.Portal')

.controller('OfficeUsageController', ['$scope', 'BookingService', function($scope, BookingService) {

    // 今日已满

    // key = 0479f830b0c6e2cd
    // md5: app=kii&id=240479f830b0c6e2cd
    $scope.rooms = [{
        id: 24,
        sign: 'eba8612347af80999a60e9d32ff9a270',
        no: '8-7-11-N',
        name: '十里亭',
        location: '0807W-M07'
    }, {
        id: 25,
        sign: 'af742effbfbabb0c0043e113707a7b99',
        no: '8-7-13-N',
        name: '幽篁里',
        location: '0807W-M06'
    }, {
        id: 26,
        sign: 'f12bd9d4fb58a2be67d821d16a04248d',
        no: '8-7-12-N',
        name: '文昌阁',
        location: '0807W-M05'
    }, {
        id: 27,
        sign: '43ae0b1b9638aed3e693b1990a1484ff',
        no: '8-7-15-N',
        name: '勿幕阁',
        location: '0807W-M03'
    }, {
        id: 28,
        sign: 'bb8d610ad4116a57cd483dddfa8b589c',
        no: '8-7-14-N',
        name: '安定阁',
        location: '0807W-M04'
    }, {
        id: 29,
        sign: '3f9d862dbacb88651348c35d74be0419',
        no: '8-7-16-N',
        name: '安远阁',
        location: '0807W-M01'
    }, {
        id: 30,
        sign: 'c262abdabff07f170a5b37afdfa272b8',
        no: '8-7-17-N',
        name: '尚检阁',
        location: '0807W-M02'
    }];
}]);