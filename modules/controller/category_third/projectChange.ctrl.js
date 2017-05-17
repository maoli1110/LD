'use strict';
/**
 * component
 * 工程管理-工程划分-合同页面js
 */
angular.module('core').controller('projectChangeCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile','$state',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile,$state) {
    	// $scope.routeId=function(changeFarterId){
    	// 	console.log(changeFarterId)
    	// 	$state.go('ld.projectChangeStake',{changeFarterId:changeFarterId})
    	// }
// 模拟列表数据
    	var idata={
				    "totalCount":7,
				    "pageSize":3,
				    "pageNumber":1,
				    "totalPage": 3,
				    "content": [
				        {
				            "id": 8,
				            "aa": "BGSQ-LJ0-01",
				            "bb": "石方开挖变更",
				            "cc": "GK0+001.254~GK0+763.236",
				            "dd": "2017-03-01",
				            "ee": "21,234,548",
				            "ff": "审核中",
					    "hh":"2"
				        },
				        {   "id": 3,
				            "aa": "BGSQ-LJ0-01",
				            "bb": "石方开挖变更",
				            "cc": "GK0+001.254~GK0+763.236",
				            "dd": "2017-03-01",
				            "ee": "21,234,548",
				            "ff": "审核中",
					    "hh":"2"
				        },
				        {
				            "id": 6,
				            "aa": "BGSQ-LJ0-01",
				            "bb": "石方开挖变更",
				            "cc": "GK0+001.254~GK0+763.236",
				            "dd": "2017-03-01",
				            "ee": "21,234,548",
				            "ff": "通过",
					    "hh":"1"
				        }
				    ]
				}

		//设置列表金额显示
		$scope.selectDisplay=function(status){
			var display='';
            if('通过'==status){
                display=''
            }else{
            	display='none'
            }
            return {"display":display}
		}

		//设置默认全部
		var chapterId = $scope.selectValue ='ilist';
        $scope.changeList=function(selectValue){
        	console.log(selectValue)
        }



       //获取当前页面的currentRouterNum
        $scope.$emit('changeRouter',commonService.getCurrentRouterNum($state.$current.name));
		// 分页参数
		var pageParam = {pageSize: 3,pageNumber: 0,queryParam: "",sortField: "id",sortType: "desc"};
		// 合同段id
		var sectionContractId=1;
		commonService.findChildItemizedInfos(pageParam, sectionContractId).then(function(data){
				$scope.childItemizedInfos = idata;
				console.log($scope.childItemizedInfos)
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
			});		};
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
		$scope.createChangeModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_third/modal_create_change.html',
                controller: 'CreateChangeModalCtrl',
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

