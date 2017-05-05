'use strict';
/**
 * component
 * 工程管理-工程划分-桩号页面js
 */
angular.module('core').controller('projectDivisionStakeCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile) {
        console.log($scope.name,'$scope.name')
        //点击左侧树节点对应的桩号(sendCtrl->projectDivisionStakeCtrl父子通信)
        $scope.$on('call',function(event,data){
            $scope.name = data;
            alert($scope.name)
        });
        // TODO 后台请求数据 此处先造假数据
        var compGroupData = new Array();
        for(var i=0;i<99;i++) {
            compGroupData.push("GK0+358.213~GK3+145.253土方工程构件组"+i);
        }
        // 更改构件组弹框控制开始
        $scope.compGroupInfos = compGroupData;
        $scope.editCompGroupAnimationsEnabled = true;
        $scope.editCompGroup = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.editCompGroupAnimationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_second/edit_comp_group.html',
                controller: 'editCompGroupCtrl',
                resolve: {
                    compGroupInfos: function () {
                        return $scope.compGroupInfos;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                //console.info('Modal dismissed at: ' + new Date());
            });
        };
        // 更改构件组弹框控制结束

        /**
         * 编辑合同图号
         */
        $scope.editContNum = function () {
            $("#editContNum").css("display","none");
            var input = $("#editContNumInput");
            input.removeAttr("disabled");
            var temp = input.val();
            input.val("").focus().val(temp);
            $("#commitContNum").css("display","inline-block");
            $("#cancelContNum").css("display","inline-block");
        };
        /**
         * 确定提交合同图号
         */
        $scope.commitContNum = function () {
            $scope.cancelContNum();
            // 提交数据

        };
        /**
         * 取消合同图号
         */
        $scope.cancelContNum = function () {
            $("#editContNumInput").attr('disabled','disabled');
            $("#editContNum").css("display","inline-block");
            $("#commitContNum").css("display","none");
            $("#cancelContNum").css("display","none");
        };

        // 删除构件组弹框控制开始
        $scope.delCompGroupAnimationsEnabled = true;
        $scope.deleteCompGroup = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.delCompGroupAnimationsEnabled,
                size: 'sm',
                templateUrl: 'template/category_second/del_comp_group.html',
                controller: 'delCompGroupCtrl'/*,
                resolve: {
                    compGroupInfos: function () {
                        return $scope.compGroupInfos;
                    }
                }*/
            });
            modalInstance.result.then(function (selectedItem) {
                //$scope.selected = selectedItem;
            }, function () {
                //console.info('Modal dismissed at: ' + new Date());
            });
        };
        // 删除构件组弹框控制结束

    }
]);

/**
 * 工程管理-工程划分-桩号-更该构件组弹框
 */
angular.module('core').controller('editCompGroupCtrl', ['$scope', '$http', '$uibModalInstance', 'compGroupInfos', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, compGroupInfos, $timeout, commonService) {
        $scope.compGroupInfos = compGroupInfos;
        $scope.selected = {
            item: $scope.compGroupInfos[0]
        };
        // 默认选中第一个
        var oldSelectedCompGroupId = 'compGroup_0';
        var first = true;
        /**
         * 点击构件组时改变背景色
         * @param ele 点击的构件组id
         */
        $scope.clickCompGroup = function (ele) {
            if(first) { // 第一次点击 不用比较 直接设置背景色
                $("#"+ele).css('background-color','#eef1f8');
                first = false;
                oldSelectedCompGroupId = ele;
                return;
            }
            if(oldSelectedCompGroupId == ele) {
                return;
            } else {    // 先把之前设置的背景色去掉 再设置新选中的背景色
                $("#"+oldSelectedCompGroupId).css('background-color','#fff');
                $("#"+ele).css('background-color','#eef1f8');
                oldSelectedCompGroupId = ele;
            }
        };

        /**
         * 筛选构件组
         * @param ele
         */
        $scope.searchCompGroup = function (ele) {

        };

        $scope.ok = function () {
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
/**
 * 工程管理-工程划分-桩号-删除构件组弹框
 */
angular.module('core').controller('delCompGroupCtrl', ['$scope', '$http', '$uibModalInstance', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, $timeout, commonService) {
        /*$scope.selected = {
            item: $scope.compGroupInfos[0]
        };*/

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);