'use strict';
/**
 * component
 */
angular.module('core').controller('listManageContractCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile','$filter',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile,$filter) {


        
      // 分页参数
      var pageParam = {pageSize: 5,pageNumber: 0,queryParam: "",sortField: "id",sortType: "desc"};
      // 桩号段id
      var sectionContractId = 3;


       //分页查询桩号清单列表
      commonService.getItemizedlist(sectionContractId,pageParam).then(function (data) {
          console.log(data);
          $scope.childItemizedInfos = data;
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
        commonService.getItemizedlist(sectionContractId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,pageParam).then(function(data){
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
        $('#clearSearchKey').css('display', 'none');
      };




       
      //分页查询桩号清单列表
      commonService.getItemizedlist(sectionContractId,pageParam).then(function (data) {
          //$scope.contractlist = data;
          //console.log(data);
          $scope.childItemizedInfos = data;
      })



      //清空桩号清单接口
      $scope.clearItemizedlist=function(){
        var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                //size: 'lg',
                templateUrl: 'template/category_second/del_construct_contact.html',
                controller: 'clearItemizedlistCtrl',
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

      //导出桩号清单

      $scope.DownloadItemizedlist = function(){
        $http.get('http://192.168.13.215:8080/LBLD/rs/itemizedlist/'+ sectionContractId +'/download' , {
          parameter:""
        },{
            responseparameterType: 'arraybuffer'
        }).then(function (res) {
            var blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
            var fileName = 'Download itemizedList.xls';
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



    $scope.animationsEnabled = true;

    $scope.createContractlist = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_second/create_construct_contract.html',
                controller: 'createContractlistCtrl',
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


	
	}])




 
//模态-编辑
angular.module('core').controller('createContractlistCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {

       // 分页参数
      var pageParam = {pageSize: 5,pageNumber: 0,queryParam: "",sortField: "id",sortType: "desc"};
      // 桩号id
      var sectionContractId = 3;



       //查询合同章节
      commonService.contractlistChapters(sectionContractId,pageParam).then(function (data) {
          console.log(data);
          $scope.chapters = data;
      })

      //清单桩号分页列表
      commonService.getItemizedlist(sectionContractId,pageParam).then(function(data){
        console.log(data)
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
        pageParam.pageNumber = currentPage - 1;
        commonService.getItemizedlist(sectionContractId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,pageParam).then(function(data){
          $scope.childItemizedInfos = data;
          console.log($scope.childItemizedInfos)
        });
      };
      /**
       * 搜索框内的 X 隐藏控制
       */
      $scope.clearSearchKey = function(){
        // 当内容页也有搜索框时，用class定位会出错，故改为id定位
        $('#searchChildItemsValue2').val('').focus();
        $('#clearSearchKey2').css('display', 'none');
      };


        /*$scope.ok = function () {
            $uibModalInstance.close($scope.selected.item);
        };*/


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


      

        $scope.changeClass = function(target){

             if (target.getAttribute("class")){
                 target.setAttribute("class","");
              }else{
                target.setAttribute("class","active");
           };

        };


       $scope.selectBtn = function(target){

        if(target.getAttribute('sele')){

            alert("全部")
        }else{

            alert("已选")
        }
       }
       


    $scope.save = function(){
       if($(".table-list input").hasClass("ng-invalid")){
        $scope.isShow = true;
        $timeout(function(){
            $scope.isShow = false;
        },1000)
       }else{
         $uibModalInstance.close($scope.selected.item);
       }

    }


    }])
//清空桩号清单
angular.module('core').controller('clearItemizedlistCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {


      $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
     $scope.ok = function () {
          alert("清空了")
         // $uibModalInstance.close();
          /*commonService.ItemizedlistClear(sectionContractId).then(function (data) {
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
