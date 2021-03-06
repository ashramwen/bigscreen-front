'use strict';

angular.module('BigScreen.Portal')

    .controller('MeetingRoomController', ['$scope', function ($scope) {

        // 今日已满

        // key = 0479f830b0c6e2cd
        // md5: app=kii&id=240479f830b0c6e2cd
        $scope.rooms = [{
            id: 24,
            sign: 'eba8612347af80999a60e9d32ff9a270',
            no: '8-7-1-W',
            name: '十里亭',
            location: '0807w-W07'
        }, {
            id: 25,
            sign: 'af742effbfbabb0c0043e113707a7b99',
            no: '8-7-2-W',
            name: '幽篁里',
            location: '0807w-W06'
        }, {
            id: 26,
            sign: 'f12bd9d4fb58a2be67d821d16a04248d',
            no: '8-7-3-W',
            name: '文昌阁',
            location: '0807w-W05'
        }, {
            id: 27,
            sign: '43ae0b1b9638aed3e693b1990a1484ff',
            no: '8-7-4-W',
            name: '勿幕阁',
            location: '0807w-W03'
        }, {
            id: 28,
            sign: 'bb8d610ad4116a57cd483dddfa8b589c',
            no: '8-7-5-W',
            name: '安定阁',
            location: '0807w-W04'
        }, {
            id: 29,
            sign: '3f9d862dbacb88651348c35d74be0419',
            no: '8-7-8-W',
            name: '安远阁',
            location: '0807w-W01',
            showCondition: true
        }, {
            id: 30,
            sign: 'c262abdabff07f170a5b37afdfa272b8',
            no: '8-7-9-W',
            name: '尚检阁',
            location: '0807w-W02',
            showCondition: true
        }];
    }]);