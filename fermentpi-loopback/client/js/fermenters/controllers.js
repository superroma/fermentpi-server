'use strict';

angular
    .module('app')
    .controller('FermenterListCtrl', ['$scope', '$state', 'Controller',
        function ($scope, 
            $state, Controller) {
            $scope.controllers = [];

            function getFermenters() {
                Controller
                    .find({filter:{include: "Fermenters"}})
                    .$promise
                    .then(function (results) {
                        $scope.controllers = results;
                    });
            }
            getFermenters();
        }
    ])
    .controller('FermenterDetailCtrl', ['$scope', '$stateParams', 'Fermenter',
        function($scope, $stateParams, Fermenter) {
            $scope.fermenterId = $stateParams.fermenterId;
            $scope.fermenter = {};
            Fermenter.findById({id:$scope.fermenterId})
                .$promise
                .then(function(result) {
                    $scope.fermenter = result;
            });
            $scope.tempReadings = {};
            Fermenter.TempReadings({
                id: $scope.fermenterId, 
                where:{limit:100}
            }).$promise
                .then(function(result) {
                    $scope.tempReadings = result;
            });
        }
    ]);
                                         