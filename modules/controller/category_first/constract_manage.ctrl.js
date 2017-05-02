/**
 * Created by caoxx on 2017/4/28.
 */
'use strict';
/**
 * component
 */
angular.module('core').controller('constractManageCtrl', ['$scope', '$http', '$uibModal', 'commonService', '$timeout', '$compile',
    function ($scope, $http, $uibModal, commonService, $timeout, $compile) {
        /*
         * 初始化模态框
         * 初始化参数配置
         * */
        $scope.items = ['item1', 'item2', 'item3'];
        $scope.animationsEnabled = true;
        $scope.createConstructModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_first/modal_create_construct_contract.html',
                controller: 'ModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                
            });
        };

        $scope.createSuperviseModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_first/modal_create_supervise_contract.html',
                controller: 'ModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        };


        $scope.createLabModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_first/modal_create_Lab_contract.html',
                controller: 'ModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        };


        $scope.editModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/core/edit_constract.html',
                controller: 'ModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        };


        $scope.deleteModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                // size: 'sm',
                templateUrl: 'template/category_first/modal_delete_constract.html',
                controller: 'ModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                //console.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    }]);