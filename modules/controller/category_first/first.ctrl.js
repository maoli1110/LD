'use strict';
/**
 * component
 */
angular.module('core').controller('firstCtrl', ['$scope', '$http', '$uibModal', 'commonService', '$timeout', '$compile', '$state', 'FileUploader',
    function ($scope, $http, $uibModal, commonService, $timeout, $compile, $state, FileUploader) {
        // console.log($scope.first.contractId);
        //获取当前路由的routerNum,同时通知父级修改
        commonService.getCurrentRouterNum($state.$current.name);
        $scope.$emit('changeRouter',commonService.getCurrentRouterNum($state.$current.name));

        // contractlist是否完成repeat标志
        $scope.flag = {
            contractListRepeat: false
        };

        //获取项目部
        commonService.getDept().then(function (data) {
            $scope.deptList = data;
        })

        // 获取左侧的项目部id
        $scope.getContractId = function (deptId) {
            $scope.deptId = deptId;
        };

        /*
         * 初始化模态框
         * 初始化参数配置
         * */
        $scope.animationsEnabled = true;
        // 新建施工合同
        $scope.createConstructModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_first/modal_create_construct_contract.html',
                controller: 'CreateConstractModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.deptId;
                    }
                }
            });
            modalInstance.result.then(function (sendContent) {
                // $scope.selected = selectedItem;
                // console.log(selectedItem);
            });
        };
        // 新建监理合同
        $scope.createSuperviseModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_first/modal_create_supervise_contract.html',
                controller: 'CreateSupervisionModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.deptId;
                    }
                }
            });
            modalInstance.result.then(function (sendContent) {
                // $scope.selected = selectedItem;
            });
        };
        // 新建试验室合同
        $scope.createLabModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_first/modal_create_Lab_contract.html',
                controller: 'CreateSupervisionLabModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.deptId;
                    }
                }
            });
            modalInstance.result.then(function (sendContent) {
            });
        };
        // 编辑施工合同
        $scope.editConstructModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_first/modal_edit_construct_contract.html',
                controller: 'EditConstractModalCtrl',
                resolve: {
                    items: function () {
                        return {
                            id: $scope.id,
                            deptId: $scope.deptId,
                            constructConstractInfos: $scope.constructConstractInfos
                        };
                    }
                }
            });
            modalInstance.result.then(function (sendContent) {
                // $scope.selected = selectedItem;
                // console.log(selectedItem);
            });
        };
        // 编辑监理合同
        $scope.editSuperviseModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_first/modal_edit_supervise_contract.html',
                controller: 'EditSupervisionModalCtrl',
                resolve: {
                    items: function () {
                        return {
                            id: $scope.id,
                            deptId: $scope.deptId,
                            supervisionConstractInfos: $scope.supervisionConstractInfos
                        };
                    }
                }
            });
            modalInstance.result.then(function (sendContent) {
            });
        };
        // 编辑试验室合同
        $scope.editLabModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_first/modal_edit_Lab_contract.html',
                controller: 'EditSupervisionLabModalCtrl',
                resolve: {
                    items: function () {
                        return {
                            id: $scope.id,
                            deptId: $scope.deptId,
                            labConstractInfos: $scope.labConstractInfos
                        };
                    }
                }
            });
            modalInstance.result.then(function (sendContent) {
            });
        };
        // 删除合同
        $scope.deleteConstractModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                // size: 'sm',
                templateUrl: 'template/category_first/modal_delete_constract.html',
                controller: 'deleteConstractModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.id;
                    }
                }
            });
            modalInstance.result.then(function () {

            });
        };
        $scope.deleteSupervisionModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                // size: 'sm',
                templateUrl: 'template/category_first/modal_delete_constract.html',
                controller: 'deleteSupervisionModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.id;
                    }
                }
            });
            modalInstance.result.then(function () {

            });
        };
        $scope.deleteSupervisionLabModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                // size: 'sm',
                templateUrl: 'template/category_first/modal_delete_constract.html',
                controller: 'deleteSupervisionLabModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.id;
                    }
                }
            });
            modalInstance.result.then(function () {

            });
        };
        // 预览合同
        $scope.previewModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_first/modal_preview.html',
                controller: 'PreviewConstractModalCtrl',
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

        // 获取左侧的合同id
        $scope.getContractTarget = function (element, id) {
            $scope.id = id;
            // console.log(element);
            // console.log(id);
            // 施工合同数据展示
            var constructConstractId = id;
            if (!constructConstractId) {
                constructConstractId = 2;
            }
            commonService.getConstructConstractInfos(constructConstractId).then(function (data) {
                $.each(data, function (i, v) {
                    if (null == v || undefined == v) {
                        data[i] = ' ';
                    }
                });
                // ！！！！！！！！！！！！！！！文件假数据
                // ！！！！！！！！！！！！！！！文件假数据
                data.contractFiles = [
                    {
                        fileMD5: 2222222,
                        fileName: "只是为了好玩：Linux之父林纳斯自传.pdf",
                        fileSize: 25269642,
                        fileUUID: 1,
                        id: 0
                    },
                    {
                        fileMD5: 2222222,
                        fileName: "Linux之父林纳斯自传.pdf",
                        fileSize: 25269642,
                        fileUUID: 1,
                        id: 0
                    }
                ];
                $scope.constructConstractInfos = data;

                console.log(data);
            })
            // 删除合同和编辑合同控制请选中一个合同
            selectProject(element)
            function selectProject(element) {
                $(".selectProject").removeClass("selectProject");
                $(element).addClass("selectProject");
            }

            // 监理合同数据展示
            var supervisionConstractId = id;
            commonService.getSupervisionConstractInfos(supervisionConstractId).then(function (data) {
                // ！！！！！！！！！！！！！！！文件假数据
                data.contractFiles = [
                    {
                        fileMD5: 2222222,
                        fileName: "林纳斯自传.pdf",
                        fileSize: 25269642,
                        fileUUID: 1,
                        id: 0
                    },
                    {
                        fileMD5: 2222222,
                        fileName: "林纳斯自传.pdf",
                        fileSize: 25269642,
                        fileUUID: 1,
                        id: 0
                    }
                    ]
                $scope.supervisionConstractInfos = data;
                // console.log(data);
            })

            // // 监理试验室合同数据展示
            var labConstractId = id;
            commonService.getLabConstractInfos(labConstractId).then(function (data) {
                // ！！！！！！！！！！！！！！！文件假数据
                $scope.labConstractInfos = data;
                data.contractFiles = [
                    {
                        fileMD5: 2222222,
                        fileName: "只是为了好玩.pdf",
                        fileSize: 25269642,
                        fileUUID: 1,
                        id: 0
                    },
                    {
                        fileMD5: 2222222,
                        fileName: "Linux.pdf",
                        fileSize: 25269642,
                        fileUUID: 1,
                        id: 0
                    }
                ];
                // console.log(data);
            })
        }

        //contractlist repeat finish end
        $scope.$on('contractlistNgRepeatFinished', function () {
            if (!$scope.flag.contractListRepeat) {
                $scope.flag.contractListRepeat = true;
            }
        });
    }]);