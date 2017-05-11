'use strict';
/**
 * component
 */
angular.module('core').controller('listManageContractFileUploadCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile','$filter',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile,$filter) {

	
    $scope.animationsEnabled = true;

    //QA
     $(".QA-icon img").mouseover(function(){
        $(".QA-icon p").stop().slideDown();
      }).mouseout(function(){
         $(".QA-icon p").stop().slideUp();
      })





 //合同....
 // 分页参数
      var pageParam = {pageSize: 5,pageNumber: 0,queryParam: "",sortField: "id",sortType: "desc"};
      // 合同段id
      var sectionContractId = 3;
      //合同清单列表
      var chapterId = $scope.myValue ='list';
      commonService.getContractlist(sectionContractId,chapterId,pageParam).then(function(data){
        console.log(data)
        $scope.childItemizedInfos = data;
        data.content.length==0?$scope.divShow=true:$scope.divShow=false;
      });

       //分页根据章节查询合同清单
      $scope.changeFn = function(){
        chapterId = $scope.myValue;
        pageParam.pageNumber=0;
        commonService.getContractlist(sectionContractId,chapterId,pageParam).then(function(data){
            $scope.childItemizedInfos = data;
          });
      }

      //查询合同章节
      commonService.contractlistChapters(sectionContractId,pageParam).then(function (data) {
          //console.log(data);
          $scope.chapters = data;
      })



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
        commonService.getContractlist(sectionContractId,chapterId,pageParam).then(function(data){
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
        commonService.getContractlist(sectionContractId,chapterId,pageParam).then(function(data){
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
        commonService.getContractlist(sectionContractId,chapterId,pageParam).then(function(data){
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
        commonService.getContractlist(sectionContractId,chapterId,pageParam).then(function(data){
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
        commonService.getContractlist(sectionContractId,chapterId,pageParam).then(function(data){
          $scope.childItemizedInfos = data;
          console.log($scope.childItemizedInfos)
        });
      };
      /**
       * 搜索框内的 X 隐藏控制
       */
      $scope.clearSearchKey = function(){
        // 当内容页也有搜索框时，用class定位会出错，故改为id定位
        $('#searchChildItemsValue1').val('').focus();
        $('#clearSearchKey1').css('display', 'none');
      };




       //导出合同清单

      $scope.DownloadContractlist = function(){
        $http.get('http://192.168.13.215:8080/LBLD/rs/contractlist/'+ sectionContractId +'/download' , {
          parameter:""
        },{
            responseparameterType: 'arraybuffer'
        }).then(function (res) {
            var blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
            var fileName = 'Download contractlist.xls';
            downFile(blob, fileName);
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
        var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                //size: 'lg',
                templateUrl: 'template/category_second/del_construct_contact.html',
                controller: 'clearContractlistCtrl',
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

      }


      //提交清单
        $scope.subContractlist=function(){
        var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                //size: 'lg',
                templateUrl: 'template/category_second/sub_construct_contact.html',
                controller: 'subContractlistCtrl',
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

      }



    }])
    //清空合同清单
    angular.module('core').controller('clearContractlistCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
        function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {


          $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
         $scope.ok = function () {
              alert("清空了")
             // $uibModalInstance.close();
              /*commonService.ContractlistClear(sectionContractId).then(function (data) {
                $scope.childItemizedInfos = data;
                //console.log(data);
            })*/
          };
      }])


    //提交
    angular.module('core').controller('subContractlistCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
        function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {


          $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
         $scope.ok = function () {
              alert("提交")
             // $uibModalInstance.close();
          };







        }])
