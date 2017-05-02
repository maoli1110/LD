'use strict';
/**
 * component
 * 工程管理-工程划分-桩号页面js
 */
angular.module('core').controller('projectDivisionStakeCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile) {
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

        // 编辑合同图号
        $scope.editContNum = function () {
            $("#editContNum").css("display","none");
            var input = $("#editContNumInput");
            input.removeAttr("disabled");
            var temp = input.val();
            input.val("").focus().val(temp);
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