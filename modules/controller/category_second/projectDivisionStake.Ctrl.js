'use strict';
/**
 * component
 * 工程管理-工程划分-桩号页面js
 */
angular.module('core').controller('projectDivisionStakeCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile) {
        console.log($scope.name,'$scope.name');
        $scope.ppid = $scope.openPpid;
        //点击左侧树节点对应的桩号(sendCtrl->projectDivisionStakeCtrl父子通信)
        $scope.$on('call',function(event,stakeInfo, ppid){
            $scope.stakeInfo = stakeInfo;
            $scope.ppid = ppid;
        });

        
        // 获取子分项工程的明细信息(桩号、合同图号、已关联构件组、发起时间)
        if($scope.stakeInfo != null) {
            commonService.findChildItemizedDetail($scope.stakeInfo.treeId).then(function(data){
                $scope.stakeInfo.stakeNum = data.data.stakeMark;  // 桩号
                $scope.stakeInfo.contractPictureNum = data.data.contractPictureNum;    // 合同图号
                $scope.stakeInfo.compGroupId = data.data.compGroupId;    // 已关联构件组id
                $scope.stakeInfo.compGroupName = data.data.compGroupName;    // 已关联构件组名称
                $scope.stakeInfo.createTime = 1493575264000;    // 创建时间
                $scope.stakeInfo.childItemId = data.data.id;    // 内容页该子分项工程的id
            });
        }

        // 拼接页面左上角要显示的字符串
        //var title = $scope.stakeInfo.contractName+'>'+$scope.stakeInfo.unitProjeditCompGroupectName+'>'+$scope.stakeInfo.deptProjectName+'>'+$scope.stakeInfo.childItemizedName+'|'+$scope.stakeInfo.itemizedNameNum;
        //$scope.stakeInfo.title = title;

        // 更改构件组弹框控制开始
        $scope.editCompGroup = function () {
            if($scope.ppid != null) {
                // 请求构件组数据
                commonService.findCompGroupsByPpid($scope.ppid).then(function(data){
                    // 弹框
                    var modalInstance = $uibModal.open({
                        //animation: true,    // 弹框的动画效果 默认是true
                        size: 'lg',
                        templateUrl: 'template/category_second/edit_comp_group.html',
                        controller: 'editCompGroupCtrl',
                        resolve: {
                            compGroupInfos: function () {
                                return data.data;
                            }
                        }
                    });
                    modalInstance.result.then(function (compGroupInfo) {
                        commonService.updateCompGroupId($scope.stakeInfo.childItemId, compGroupInfo.compGroupId).then(function(){
                            console.log('修改构件组成功');
                            $('#compGroupName').val(compGroupInfo.name);
                        });
                    }, function () {
                        //console.info('Modal dismissed at: ' + new Date());
                        console.log("取消修改构件组");
                    });
                });
            }
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
            // TODO 提交数据
            commonService.updateContractPictureNum($scope.stakeInfo.childItemId,$("#editContNumInput").val()).then(function(){
                console.log('修改合同图号成功');
            });
            $scope.cancelContNum();
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
        $scope.deleteCompGroup = function () {
            // 如果构件组id已经删除过，不再执行删除操作
            var compGroupName = $('#compGroupName').val();
            if($scope.stakeInfo.compGroupId === '' || compGroupName === '') {
                return;
            }
            var modalInstance = $uibModal.open({
                //animation: true,    // 弹框的动画效果 默认是true
                size: 'sm',
                templateUrl: 'template/category_second/del_comp_group.html',
                controller: 'delCompGroupCtrl'
            });
            modalInstance.result.then(function () {
                commonService.updateCompGroupId($scope.stakeInfo.childItemId, '\'\'').then(function(){
                    $('#compGroupName').val('');
                    $scope.stakeInfo.compGroupId = '';
                    console.log('删除构件组成功');
                });
            }, function () {
                //console.info('Modal dismissed at: ' + new Date());
                console.log('取消删除构件组');
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
        $scope.allCompGroupInfos = compGroupInfos;
        $scope.compGroupInfos = compGroupInfos;
        $scope.selected = {
            compGroupId: $scope.compGroupInfos[0].compGroupId
        };
        // 默认选中第一个
        var oldSelectedCompGroupId = $scope.compGroupInfos[0].compGroupId;
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
         */
        $scope.searchCompGroup = function () {
            var searchKey = $(".input-search").val();
            if('' === searchKey) {
                $scope.compGroupInfos = $scope.allCompGroupInfos;
                return;
            }
            var searchValue = new Array();
            for(var i = 0; i < $scope.allCompGroupInfos.length; i++) {
                var compGroupInfo = $scope.allCompGroupInfos[i];
                if(compGroupInfo.name.indexOf(searchKey)>=0) {
                    searchValue.push(compGroupInfo);
                }
            }
            $scope.compGroupInfos = searchValue;
        };

        $scope.ok = function () {
            $uibModalInstance.close($scope.selected.compGroupInfo);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        /**
         * 搜索框内的 X 隐藏控制
         */
        $scope.clearSearchKey = function(){
            $('#searchChildItemsValue').val('').focus();
            $('.clear').css('display', 'none');
            // 显示所有数据
            $scope.searchCompGroup();
        };
    }
]);
/**
 * 工程管理-工程划分-桩号-删除构件组弹框
 */
angular.module('core').controller('delCompGroupCtrl', ['$scope', '$http', '$uibModalInstance', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, $timeout, commonService) {
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);