'use strict';

angular.module('BigScreen')

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: '',
            templateUrl: 'app/app.html',
            controller: 'AppController',
            abstract: true
        })
        .state('app.Secure', {
            url: '/Secure',
            templateUrl: 'app/components/Secure/Secure.html',
            controller: 'SecureController',
        })
        .state('app.Portal', {
            url: '/Portal',
            templateUrl: 'app/components/Portal/Portal.html',
            controller: 'PortalController',
        });

    $urlRouterProvider.otherwise('Secure');
});