'use strict';
/**
 * component
 * 工程管理-工程划分-合同页面js
 */
angular.module('core').controller('projectDivisionContractCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile','$state',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile,$state) {
		// 分页参数
		var pageParam = {pageSize: 3,pageNumber: 0,queryParam: "",sortField: "id",sortType: "desc"};

		// 进入页面时获取左侧树下合同段的数据
		$scope.getContractList($scope.secondLeftTree.deptId, 2, true);

		//此时$state.$current.name=ld.projectDivisionContract
		$scope.$on('to-'+$state.$current.name,function(){
			commonService.findChildItemizedInfos(pageParam, $scope.secondLeftTree.contractId).then(function(data){
				$scope.childItemizedInfos = data.data;
			});
		});


		commonService.findChildItemizedInfos(pageParam, $scope.secondLeftTree.contractId).then(function(data){
			$scope.childItemizedInfos = data.data;
		});

		//获取当前路由的routerNum,同时通知父级修改
        commonService.getCurrentRouterNum($state.$current.name);
        $scope.$emit('changeRouter',commonService.getCurrentRouterNum($state.$current.name));

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
			commonService.findChildItemizedInfos(pageParam, $scope.secondLeftTree.contractId).then(function(data){
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
			commonService.findChildItemizedInfos(pageParam, $scope.secondLeftTree.contractId).then(function(data){
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
			commonService.findChildItemizedInfos(pageParam, $scope.secondLeftTree.contractId).then(function(data){
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
			commonService.findChildItemizedInfos(pageParam, $scope.secondLeftTree.contractId).then(function(data){
				$scope.childItemizedInfos = data.data;
			});
		};

		/**
		 * 搜索框搜索功能实现
		 */
		$scope.searchChildItems = function(){
			var queryParam = $("#searchChildItemsValue").val();
			pageParam.queryParam = queryParam;
			pageParam.pageNumber = 0;
			commonService.findChildItemizedInfos(pageParam, $scope.secondLeftTree.contractId).then(function(data){
				$scope.childItemizedInfos = data;
			});
		};
		/**
		 * 搜索框内的 X 隐藏控制
		 */
		$scope.clearSearchKey = function(){
			// 当内容页也有搜索框时，用class定位会出错，故改为id定位
			$('#searchChildItemsValue').val('').focus();
			$('#clearSearchKey').css('display', 'none');
			$scope.searchChildItems();
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
			commonService.findChildItemizedInfos(pageParam, $scope.secondLeftTree.contractId).then(function(data){
				$scope.childItemizedInfos = data;
			});
		};
    }
]);