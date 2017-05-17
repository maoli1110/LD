'use strict';
/**
 * component
 */
angular.module('core').controller('listManageContractCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile','$filter','$state',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile,$filter,$state) {

        //合同....
       // 分页参数
      var pageParam = {pageSize: 5,pageNumber: 0,queryParam: "",sortField: "id",sortType: "desc"};
      // 合同段id
      //var sectionContractId = 3;
      //合同清单列表
      var chapterId = $scope.myValue ='list';

       //获取当前页面的currentRouterNum
      $scope.$emit('changeRouter',commonService.getCurrentRouterNum($state.$current.name));



        // 进入页面时获取左侧树下合同段的数据
        $scope.getContractList($scope.secondLeftTree.deptId, 2, true);
        //此时$state.$current.name=ld.listManageContract
        $scope.$on('to-'+$state.$current.name,function(){
          //分页查询合同
         commonService.getContractlist($scope.secondLeftTree.contractId,chapterId,pageParam).then(function(data){
            $scope.childItemizedInfos = data;
            $scope.childItemizedInfos.content.length==0?$scope.divShow=true:$scope.divShow=false;
          });
          //查询合同章节
          commonService.contractlistChapters($scope.secondLeftTree.contractId).then(function (data) {
            $scope.chapters = data.data;
          })
        });
        //分页查询合同
        commonService.getContractlist($scope.secondLeftTree.contractId,chapterId,pageParam).then(function(data){
            $scope.childItemizedInfos = data;
            $scope.childItemizedInfos.content.length==0?$scope.divShow=true:$scope.divShow=false;
          });
         //查询合同章节
        commonService.contractlistChapters($scope.secondLeftTree.contractId).then(function (data) {
            $scope.chapters = data.data;
        })


        //获取当前路由的routerNum,同时通知父级修改
        commonService.getCurrentRouterNum($state.$current.name);
        $scope.$emit('changeRouter',commonService.getCurrentRouterNum($state.$current.name));







    $scope.animationsEnabled = true;

    //QA
     $(".QA-icon span").mouseover(function(){
        $(".QA-icon p").stop().slideDown();
      }).mouseout(function(){
         $(".QA-icon p").stop().slideUp();
      })


       //分页根据章节查询合同清单
      $scope.changeFn = function(){
        chapterId = $scope.myValue;
        pageParam.pageNumber=0;
        commonService.getContractlist($scope.secondLeftTree.contractId,chapterId,pageParam).then(function(data){
            $scope.childItemizedInfos = data;
          });
      }

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
        commonService.getContractlist($scope.secondLeftTree.contractId,chapterId,pageParam).then(function(data){
          $scope.childItemizedInfos = data;
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
        commonService.getContractlist($scope.secondLeftTree.contractId,chapterId,pageParam).then(function(data){
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
        pageParam.pageNumber = currentPage - 1;
        commonService.getContractlist($scope.secondLeftTree.contractId,chapterId,pageParam).then(function(data){
          $scope.childItemizedInfos = data;
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
        commonService.getContractlist($scope.secondLeftTree.contractId,chapterId,pageParam).then(function(data){
          $scope.childItemizedInfos = data;
        });
      };
      /**
     * 搜索框搜索功能实现
     */
      $scope.searchChildItems = function(){
        var queryParam = $("#searchChildItemsValue").val();
        pageParam.queryParam = queryParam;
        pageParam.pageNumber = 0;
        commonService.getContractlist($scope.secondLeftTree.contractId,chapterId,pageParam).then(function(data){
          $scope.childItemizedInfos = data;
          //console.log($scope.childItemizedInfos)
        });
      };
      /**
       * 搜索框内的 X 隐藏控制
       */
      $scope.clearSearchKey = function(){
        // 当内容页也有搜索框时，用class定位会出错，故改为id定位
        $('#searchChildItemsValue').val('').focus();
        $('#clearSearchKey1').css('display', 'none');
      };

      //导入合同清单
      $scope.uploadFile = function(){
        alert("导入清单")
        /*commonService.uploadContractlist($scope.secondLeftTree.contractId).then(function(data){
            $scope.childItemizedInfos = data;
            console.log($scope.childItemizedInfos)
          });*/
      }

      //导出合同清单

      $scope.DownloadContractlist = function(){
        if($scope.childItemizedInfos.content.length==0){
          alert("请导入清单");
          return false;
        }
        commonService.contractlistDownload($scope.secondLeftTree.contractId).then(function(data){
          console.log(data)
          //$scope.childItemizedInfos = data;
        });
        function downFile(blob, fileName) {
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, fileName);
            } else {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
                window.URL.revokeObjectURL(link.href);
            }
        }
      }

      //清空合同清单接口
      $scope.clearContractlist=function(){
        if($scope.childItemizedInfos.content.length==0){
          alert("请导入清单");
          return false;
        }
        var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                //size: 'lg',
                templateUrl: 'template/category_second/del_construct_contact.html',
                controller: 'clearContractlistCtrl',
                resolve: {
                    items: function () {
                        return $scope.secondLeftTree.contractId;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.childItemizedInfos.content = selectedItem.content;
                $scope.divShow = selectedItem.divShow;
                $scope.chapters = selectedItem.chapters;
                chapterId = 'list';
            }, function () {
                //console.log('取消')
            });

      }


      //提交清单
        $scope.subContractlist=function(){
        if($scope.childItemizedInfos.content.length==0){
          alert("请导入清单");
          return false;
        }
        var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                //size: 'lg',
                templateUrl: 'template/category_second/sub_construct_contact.html',
                controller: 'subContractlistCtrl',
                resolve: {
                    items: function () {
                        return $scope.secondLeftTree.contractId;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                //console.info('Modal dismissed at: ' + new Date());
            });

      }



    }])
    //清空合同清单
    angular.module('core').controller('clearContractlistCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
        function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {
          //当前合同ID
          $scope.contractId = items;

          $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
         $scope.ok = function () {
              var selectedItem
              commonService.ContractlistClear($scope.contractId).then(function (data) {
                selectedItem={"content":[],"divShow":true,"chapters":[]}
                $uibModalInstance.close(selectedItem);
               })
              
          };
      }])


    //提交
    angular.module('core').controller('subContractlistCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
        function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {

          //当前清单ID
          $scope.contractId = items;
          $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
         $scope.ok = function () {
            commonService.submitContractlist($scope.contractId).then(function (data) {
                //console.log(data);
            })
            $uibModalInstance.close();
          };

        }])







