'use strict';
/**
 * component
 */


angular.module('core').controller('firstCtrl', ['$scope', '$http', '$uibModal', 'commonService', '$timeout', '$compile',
    function ($scope, $http, $uibModal, commonService, $timeout, $compile) {

        //contractlist是否完成repeat标志
        // $scope.flag={
        //     contractListRepeat:false
        // };
        
        //获取项目部
        commonService.getDept().then(function(data){
            $scope.deptList = data;
        })

        //获取项目部下合同段
        $scope.getContractList = function(deptId){
            commonService.getContractList(deptId).then(function(data){
                $scope.contractList = data.data;
            });
        }


        /*
         * 初始化模态框
         * 初始化参数配置
         * */
        $scope.items = ['item1', 'item2', 'item3'];
        $scope.animationsEnabled = true;
        // 新建施工合同
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
        // 新建监理合同
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
        // 新建试验室合同
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
        // 删除合同
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
        // 预览合同
        $scope.previewModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_first/modal_preview.html',
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

        var modalMap = {};
        // 页面下拉菜单控制
        console.log(111);
        function onClick(buttonID, templateID, btnNone) {
            $('#' + buttonID).css('display', 'inline-block');
            var btnNone = btnNone.split(',');
            btnNone.forEach(function (i, v) {
                $('#' + i).css('display', 'none');
            });
            $('#' + templateID).css('display', 'inline-block').siblings().css('display', 'none');
        }

        $('.dropdown-menu li').on('click', function () {
            var buttonID = $(this).attr('buttonID');
            var templateID = $(this).attr('templateID');
            var btnNone = $(this).attr('btnNone');
            onClick(buttonID, templateID, btnNone);
            modalMap.buttonID = buttonID;

        });

        $('.edit-contract').on('click', function (e) {
            console.log(modalMap.buttonID);
            e.preventDefault();
            var $select = $(".selectProject");

            if ($select.length == 0) {
                alert('请选择一个合同');
                return;
            }
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
        // 删除合同和编辑合同控制请选中一个合同
        $('.attachment .attachment-operate').on("click", function () {
            selectProject(this);
        });

        // 删除附件
        $('.file-wrapper .file-item').on("click", function () {
            selectProject(this);
        });

        function selectProject(element) {
            $(".selectProject").removeClass("selectProject");
            $(element).addClass("selectProject");
        }

        $('#delete-contract').on('click', function () {
            var $select = $(".selectProject");
            if ($select.length == 0) {
                alert('请选择一个合同');
                return;
            }
            $(this).attr('ng-click', $scope.deleteModal());

        });

        console.log($('#btn-delete'));
        $('#btn-delete').on('click', function () {
            var $select = $(".selectProject");
            if ($select.length == 0) {
                alert('请选择一个合同');
                return;
            }
            $(this).attr('ng-click', $scope.deleteModal());

        });

        // 施工合同数据展示
        var constructConstractId = 2;
        commonService.getConstructConstractInfos(constructConstractId).then(function (data) {
            $scope.constructConstractInfos = data;
        })

        // 监理合同数据展示
        // var supervisionConstractId = 1;
        // commonService.getSupervisionConstractInfos(supervisionConstractId).then(function (data) {
        //     $scope.supervisionConstractInfos = data;
        //     // console.log(data);
        // })
        //
        // // 监理试验室合同数据展示
        // var labConstractId = 1;
        // commonService.getLabConstractInfos(labConstractId).then(function (data) {
        //     $scope.labConstractInfos = data;
        //     // console.log(data);
        // })

        //contractlist repeat finish end
        // $scope.$on('contractlistNgRepeatFinished',function(){
        //     if(!$scope.flag.contractListRepeat){
        //         $scope.flag.contractListRepeat=true;
        //     }
        // });
    }]);