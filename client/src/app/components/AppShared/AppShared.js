'use strict';

angular.module('BigScreen.AppShared', ['ngAnimate', 'ngSanitize',
        'ui.bootstrap', 'LocalStorageModule', 'ui.router',
        'BigScreen.Secure',
        'BigScreen'
    ])
    .constant('AppConfig', {
        StoragePrefix: 'BigScreen',
        USER_SESSION: 'USER_SESSION'
    })
    .config(function(localStorageServiceProvider, AppConfig) {
        localStorageServiceProvider
            .setPrefix(AppConfig.StoragePrefix)
            .setStorageType('localStorage')
            .setStorageCookie(30, '/')
            .setNotify(true, true);
    });