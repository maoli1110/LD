'use strict';
/**
 * component
 * 工程管理-工程划分-合同页面js
 */
angular.module('core').controller('projectDivisionContractCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile','$state',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile,$state) {
       
		// 分页参数
		var pageParam = {pageSize: 3,pageNumber: 1,queryParam: "00",sortField: "id",sortType: "desc"};
		// 合同段id
		var sectionContractId = 1;
		commonService.findChildItemizedInfos(pageParam, sectionContractId).then(function(data){
			$scope.childItemizedInfos = data;
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
			pageParam.pageNumber = currentPage;
			commonService.findChildItemizedInfos(pageParam, sectionContractId).then(function(data){
				$scope.childItemizedInfos = data;
			});
		};
		/**
		 * 下一页
		 */
		$scope.nextPage = function(){
			var currentPage = $("#currentPage").val();
			if(currentPage == $scope.childItemizedInfos.totalPage) {
				return;
			}
			$("#currentPage").val(++currentPage);
			pageParam.pageNumber = currentPage;
			commonService.findChildItemizedInfos(pageParam, sectionContractId).then(function(data){
				$scope.childItemizedInfos = data;
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
			pageParam.pageNumber = currentPage;
			commonService.findChildItemizedInfos(pageParam, sectionContractId).then(function(data){
				$scope.childItemizedInfos = data;
			});
		};
		/**
		 * 尾页
		 */
		$scope.lastPage = function(){
			var currentPage = $("#currentPage").val();
			var totalPage = $scope.childItemizedInfos.totalPage;
			if(currentPage == totalPage) {
				return;
			}
			$("#currentPage").val(totalPage);
			pageParam.pageNumber = totalPage;
			commonService.findChildItemizedInfos(pageParam, sectionContractId).then(function(data){
				$scope.childItemizedInfos = data;
			});
		};
    }
]);