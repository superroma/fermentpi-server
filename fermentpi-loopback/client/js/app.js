'use strict';

angular
    .module('app', [
    'lbServices',
    'ui.router','dx'
  ])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('fermenterslist', {
                    url: '/fermenters',
                    templateUrl: 'js/fermenters/templates/fermenterlist.html',
                    controller: 'FermenterListCtrl'
                }).state('fermenterdetails', {
                    url: '/fermenter/:fermenterId',
                    templateUrl: 'js/fermenters/templates/fermenterdetail.html',
                    controller: 'FermenterDetailCtrl'

                });
            $urlRouterProvider.otherwise('/fermenters');
        }
    ]);