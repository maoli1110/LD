'use strict';
/**
 * component
 * 工程管理-工程划分-合同页面js
 */
angular.module('core').controller('projectChangeStakeCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile','$state','$stateParams',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile,$state,$stateParams) {
        console.log($stateParams.changeFarterId)
        var listName={
                    "content": [
                        {
                            "id": "设计变更审批表",
                        },
                        {   "id": "设计变更计算表",
                        },
                        {
                            "id": "设计变更立项申请表",
                        },
                        {
                            "id": "设计变更现场会审纪要",
                        },
                        {   "id": "设计变更工程数量计算表",
                        }
                    ]
                }
        $scope.listName=listName;
        console.log($scope.listName)
        // 模拟列表数据
        var idata={
                    "totalCount":7,
                    "pageSize":3,
                    "pageNumber":1,
                    "totalPage": 3,
                    "content": [
                        {
                            "id": "设计变更审批表",
                            "aa": "未发起",
                            "bb": "2017-03-01",
                            "cc": "2017-03-07"
                        },
                        {   "id": "设计变更计算表",
                            "aa": "未发起",
                            "bb": "2017-03-01",
                            "cc": "2017-03-07"
                        },
                        {
                            "id": "设计变更立项申请表",
                            "aa": "已通过",
                            "bb": "2017-03-01",
                            "cc": "2017-03-07"
                        },
                        {
                            "id": "设计变更现场会审纪要",
                            "aa": "退回",
                            "bb": "2017-03-01",
                            "cc": "2017-03-07"
                        },
                        {   "id": "设计变更工程数量计算表",
                            "aa": "审批中",
                            "bb": "2017-03-01",
                            "cc": "2017-03-07"
                        }
                    ]
                }
                //获取状态颜色判断
                $scope.selectColor = function(status){
                    var color='';
                    if('未发起'==status){
                        color='#333'
                    }else if('已通过'==status){
                        color='#CC9900'
                    }else if('退回'==status){
                        color='red'
                    }else if('审批中'==status){
                        color='#5D00FF'
                    }
                    return {"color":color}
                }
                //获取流程判断操作
                $scope.selectBackground = function(status){
                    var background='';
                    if('1'==status){
                        background='#333'
                    }else if('2'==status){
                        background='blue'
                    }
                    return {"background":background}
                }



       //获取当前页面的currentRouterNum
        $scope.$emit('changeRouter',commonService.getCurrentRouterNum($state.$current.name));
		// 分页参数
		var pageParam = {pageSize: 3,pageNumber: 0,queryParam: "",sortField: "id",sortType: "desc"};
		// 合同段id
		var sectionContractId = 1;
		commonService.findChildItemizedInfos(pageParam, sectionContractId).then(function(data){
				$scope.childItemizedInfos = idata;
			});
		/**
		 * 上一页
		 */
		$scope.prevPage = function(){
			var currentPage = $("#currentPage").val();
			if(currentPage == 1) {
				return;
			}
			$("#currentPage").val(--currentPage);
			pageParam.pageNumber = currentPage - 1;
			commonService.findChildItemizedInfos(pageParam, sectionContractId).then(function(data){
				$scope.childItemizedInfos = data.data;
			});
		};
		/**
		 * 下一页
		 */
		$scope.nextPage = function(){
			var currentPage = $("#currentPage").val();
			if(currentPage == $scope.childItemizedInfos.totalPages) {
				return;
			}
			$("#currentPage").val(++currentPage);
			pageParam.pageNumber = currentPage - 1;
			commonService.findChildItemizedInfos(pageParam, sectionContractId).then(function(data){
				$scope.childItemizedInfos = data.data;
			});
		};
		/**
		 * 首页
		 */
		$scope.firstPage = function(){
			var currentPage = $("#currentPage").val();
			if(currentPage == 1) {
				return;
			}
			currentPage = 1;
			$("#currentPage").val(currentPage);
			pageParam.pageNumber = currentPage - 1;
			commonService.findChildItemizedInfos(pageParam, sectionContractId).then(function(data){
				$scope.childItemizedInfos = data.data;
			});
		};
		/**
		 * 尾页
		 */
		$scope.lastPage = function(){
			var currentPage = $("#currentPage").val();
			var totalPage = $scope.childItemizedInfos.totalPages;
			if(currentPage == totalPage) {
				return;
			}
			$("#currentPage").val(totalPage);
			pageParam.pageNumber = totalPage - 1;
			commonService.findChildItemizedInfos(pageParam, sectionContractId).then(function(data){
				$scope.childItemizedInfos = data.data;
			});
		};

		/**
		 * 搜索框搜索功能实现
		 */
		$scope.searchChildItems = function(){
			var queryParam = $("#searchChildItemsValue").val();
			pageParam.queryParam = queryParam;
			pageParam.pageNumber = 1;
			commonService.findChildItemizedInfos(pageParam, sectionContractId).then(function(data){
				$scope.childItemizedInfos = data.data;
			});
		};
		/**
		 * 搜索框内的 X 隐藏控制
		 */
		$scope.clearSearchKey = function(){
			// 当内容页也有搜索框时，用class定位会出错，故改为id定位
			$('#searchChildItemsValue').val('').focus();
			$('#clearSearchKey').css('display', 'none');
		};

		/**
		 * 表头排序功能
		 * @param field 排序字段
		 * @param sortType 排序类型 0-desc 1-asc
         */
		$scope.sortChildItems = function(field, sortType){
			var queryParam = $("#searchChildItemsValue").val();
			pageParam.queryParam = queryParam;
			pageParam.pageNumber = 1;
			pageParam.sortField = field;
			pageParam.sortType = sortType ? 'asc' : 'desc';
			commonService.findChildItemizedInfos(pageParam, sectionContractId).then(function(data){
				$scope.childItemizedInfos = data.data;
			});
		};
		$scope.animationsEnabled = true;
		//签发变更令
		$scope.createChangeModalOrder = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_third/modal_create_change_stake.html',
                controller: 'CreateChangeStakeModalCtrl',
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
        //添加表单
        $scope.createChangeModalAddform= function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'template/category_third/modal_creat_change_addform.html',
                controller: 'CreateChangeFormModalCtrl',
                resolve: {
                    items: function () {
                        console.log($scope.listName)
                        return {
                            // id: $scope.id,
                            // eptId: $scope.firstLeftTree.deptId,
                            listName:$scope.listName
                        };

                    }
                }
            });
            modalInstance.result.then(function (sendContent) {
                // $scope.selected = selectedItem;
                // console.log(selectedItem);
            });
        };
        //点击名称预览
        $scope.createChangeModalPreview= function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size:'lg',
                templateUrl: 'template/category_first/modal_preview.html',
                controller: 'PreviewConstractModalCtrl',
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
        //点击状态看流程
        $scope.createChangeStatusModalPreview= function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size:'lg',
                templateUrl: 'template/category_third/modal_creat_change_stake_status.html',
                controller: 'CreateChangeStatusModalPreview',
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
        //提交
        $scope.createChangeSubmitModalPreview= function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'template/category_third/modal_create_change_submit.html',
                controller: 'CreateChangeSubmitPreview',
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
        //审核
        $scope.createChangeAuditModalPreview= function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'template/category_third/modal_create_change_audit.html',
                controller: 'CreateChangeAuditPreview',
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
        //点击删除
        $scope.createChangeDeleteModalPreview= function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'template/category_third/modal_create_change_delete.html',
                controller: 'CreateChangeDeletePreview',
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
        
    }
]);