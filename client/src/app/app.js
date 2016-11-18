'use strict'

var MyApp = angular.module('BigScreen', ['ui.router',
    'BigScreen.Secure', 'BigScreen.AppShared', 'BigScreen.Portal'
]);
MyApp.config(function($httpProvider, $stateProvider, $urlRouterProvider, $logProvider) {

    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $logProvider.debugEnabled(false);

    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
    $httpProvider.defaults.headers.common['Authorization'] = 'Bearer super_token';

    $httpProvider.interceptors.push(function($q) {
        return {
            request: function(request) {
                if (!request.params || !request.params['inv'])
                    MyApp.utils.doLoading();
                return request;
            },
            response: function(response) {
                if (!response.config.params || !response.config.params['inv'])
                    MyApp.utils.whenLoaded();
                return response;
            },
            responseError: function(response, a, b) {
                console.warn(response);
                if (!response.config.params || !response.config.params['inv'])
                    MyApp.utils.whenLoaded();
                if (response.status === 502 && response.data === 'UNAUTHORIZED')
                    window.location = '/bigscreen-front';
                if (response.data && response.data.errorCode === 'TOKEN_TIME_OUT')
                    window.location = '/bigscreen-front';
                if (response.data && response.data.errorCode === 'LOGIN_TOKEN_INVALID')
                    window.location = '/bigscreen-front';
                if (response.status === 401 || response.status === 403)
                    window.location = '/bigscreen-front';
                return $q.reject(response);
            }
        };
    });
}).run(
    ['$rootScope', '$state', '$stateParams', 'AppUtils',
        function($rootScope, $state, $stateParams, AppUtils) {

            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            window.state = $state;
            /* =======================================================
             * =======================================================
             * init AppUtils
             * =======================================================
             * =======================================================
             */
            MyApp.utils = AppUtils;
        }
    ]
);