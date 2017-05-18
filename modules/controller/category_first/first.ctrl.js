'use strict';
/**
 * component
 */
angular.module('core').controller('firstCtrl', ['$scope', '$http', '$uibModal', 'commonService', '$timeout', '$compile', '$state', 'FileUploader',
    function ($scope, $http, $uibModal, commonService, $timeout, $compile, $state, FileUploader) {
        //获取当前路由的routerNum,同时通知父级修改
        commonService.getCurrentRouterNum($state.$current.name);
        $scope.$emit('changeRouter', commonService.getCurrentRouterNum($state.$current.name));

        // contractlist是否完成repeat标志
        $scope.flag = {
            contractListRepeat: false
        };
        var modalMap = {};

        $scope.$on('to-ContractManage', function (event, contractId, currentContractType) {
            var currentContractType = currentContractType;
            $scope.id = contractId;
            commonService.getConstructConstractInfos($scope.id, currentContractType).then(function (data) {
                $scope.constructConstractInfos = data;
                $scope.constructConstractInfos.contractFiles=[
                    {
                        fileMd5:111111,
                        fileName:111111,
                        fileUUID:111111,
                        fileSize:111111
                    },
                    {
                        fileMd5:111222,
                        fileName:111222,
                        fileUUID:111222,
                        fileSize:112221
                    }
                ]

                console.log(data);
            })

            $('.dropdown-menu li').on('click', function () {
                var buttonID = $(this).attr('buttonID');
                var templateID = $(this).attr('templateID');
                var attachmentID = $(this).attr('attachmentID');
                var constractId = $(this).attr('constractId');
                var btnNone = $(this).attr('btnNone');
                onClick(buttonID, templateID, btnNone, constractId, attachmentID);
                modalMap.buttonID = buttonID;
            });
        })

        // 页面下拉菜单控制
        function onClick(buttonID, templateID, btnNone, constractId, attachmentID) {
            $('#' + buttonID).css('display', 'inline-block');
            var btnNone = btnNone.split(',');
            btnNone.forEach(function (i, v) {
                $('#' + i).css('display', 'none');
            });
            $('#' + templateID).css('display', 'inline-block').siblings().css('display', 'none');
            $('#' + attachmentID).css('display', 'block').siblings('.attachment').css('display', 'none');
            $('#' + constractId).css('display', 'block').siblings().css('display', 'none');
        }

        //编辑合同点击合同段号
        $('.edit-contract').on('click', function (e) {
            // var $select = $(".selectProject");
            //
            // if ($select.length == 0) {
            //     alert('请选择一个合同');
            //     return;
            // }
            switch (modalMap.buttonID) {
                case "createConstructModal":
                    $(this).attr('ng-click', $scope.editConstructModal());
                    break;
                case "createSuperviseModal":
                    $(this).attr('ng-click', $scope.editSuperviseModal());
                    break;
                case "createLabModal":
                    $(this).attr('ng-click', $scope.editLabModal());
                    break;
                default:
                    $(this).attr('ng-click', $scope.editConstructModal());
                    break;
            }
        });
        //删除合同点击合同段号
        $('#delete-contract').on('click', function () {
            // var $select = $(".selectProject");
            // if ($select.length == 0) {
            //     alert('请选择一个合同');
            //     return;
            // }

            switch (modalMap.buttonID) {
                case "createConstructModal":
                    $(this).attr('ng-click', $scope.deleteConstractModal());
                    break;
                case "createSuperviseModal":
                    $(this).attr('ng-click', $scope.deleteSupervisionModal());
                    break;
                case "createLabModal":
                    $(this).attr('ng-click', $scope.deleteSupervisionLabModal());
                    break;
                default:
                    $(this).attr('ng-click', $scope.deleteConstractModal());
                    break;
            }

        });
        //新建合同选择项目
        $('.btn-create').on('click', function () {
            // var $select = $(".select");
            // if ($select.length == 0) {
            //     alert('请选择一个项目');
            //     return;
            // }
            switch (modalMap.buttonID) {
                case "createConstructModal":
                    $(this).attr('ng-click', $scope.createConstructModal());
                    break;
                case "createSuperviseModal":
                    $(this).attr('ng-click', $scope.createSuperviseModal());
                    break;
                case "createLabModal":
                    $(this).attr('ng-click', $scope.createLabModal());
                    break;
                default:
                    $(this).attr('ng-click', $scope.createConstructModal());
                    break;
            }

        });

        // function selectProject(ele) {
        //     $(".select").removeClass("select");
        //     $(ele).addClass("select");
        // }

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
                        return $scope.firstLeftTree.deptId;
                    }
                }
            });
            modalInstance.result.then(function (sendContent) {
                // $scope.selected = selectedItem;
                // console.log(selectedItem);
                // $('#ul1-'+$scope.firstLeftTree.deptId).siblings('.project-name-span').trigger('click');
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
                        return $scope.firstLeftTree.deptId;
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
                        return $scope.firstLeftTree.deptId;
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
                            deptId: $scope.firstLeftTree.deptId,
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
                            deptId: $scope.firstLeftTree.deptId,
                            supervisionConstractInfos: $scope.constructConstractInfos
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
                            deptId: $scope.firstLeftTree.deptId,
                            labConstractInfos: $scope.constructConstractInfos
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
            modalInstance.result.then(function (id) {

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
            modalInstance.result.then(function (id) {
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
                        return $scope.constructConstractInfos.contractFiles;
                    }
                }
            });
            modalInstance.result.then(function () {
            });
        };
        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };


        //contractlist repeat finish end
        $scope.$on('contractlistNgRepeatFinished', function () {
            if (!$scope.flag.contractListRepeat) {
                $scope.flag.contractListRepeat = true;
            }
        });
    }]);