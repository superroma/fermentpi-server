'use strict';

angular
    .module('app')
    .controller('FermenterListCtrl', ['$scope', '$state', 'Controller',
        function ($scope,
            $state, Controller) {
            $scope.controllers = [];

            function getFermenters() {
                Controller
                    .find({
                        filter: {
                            include: "Fermenters"
                        }
                    })
                    .$promise
                    .then(function (results) {
                        $scope.controllers = results;
                    });
            }
            getFermenters();
        }
    ])
    .controller('FermenterDetailCtrl', ['$scope', '$stateParams', 'Fermenter',
        function ($scope, $stateParams, Fermenter) {
            function setChartOptions() {
                $scope.chartOptions = {
                    series: [{
                            name: 'Fermenter temp',
                            type: 'spline',
                            valueField: 'Value',
                            argumentField: 'When',
                            point: {
                                visible: false
                            }
                    }],
                    bindingOptions: {
                        dataSource: 'tempReadings'
                    },
                    animation: {
                        enabled: false
                    },
                    argumentAxis: {
                        argumentType: 'datetime',
                        grid: {
                            visible: true,
                            opacity: 0.3
                        }
                    },
                    valueAxis: {
                        tickInterval: 1,
                        grid: {
                            opacity: 0.5
                        }
                    }
                };
                $scope.rangeOptions = {
                    bindingOptions: $scope.chartOptions.bindingOptions,
                    scale: {
                        //minorTickInterval: {minutes: 10},
                        //majorTickInterval: 'day',
                        valueType: 'datetime'
                    },
                    chart: $scope.chartOptions,
                    behavior: {
                        snapToTicks: false,
                        callSelectedRangeChanged: "onMoving",
                        animationEnabled: false
                    },
                    onSelectedRangeChanged: function (e) {
                        var zoomedChart = $("#chart").dxChart('instance');
                        zoomedChart.zoomArgument(e.startValue, e.endValue);
                    }
                };
            }
            setChartOptions();
            
            $scope.fermenterId = $stateParams.fermenterId;
            $scope.fermenter = {};
            Fermenter.findById({
                id: $scope.fermenterId
            }).$promise
                .then(function (result) {
                    $scope.fermenter = result;
                });
            $scope.tempReadings = {};
            Fermenter.TempReadings({
                id: $scope.fermenterId,
                where: {
                    limit: 100
                }
            }).$promise
                .then(function (result) {
                    $scope.tempReadings = result;
                });
        }
    ]);