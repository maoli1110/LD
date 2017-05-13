'use strict';
/**
 * component
 */
angular.module('core').controller('listManageItemizedCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile','$filter',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile,$filter) {   

      // 分页参数
      var pageParam = {pageSize: 5,pageNumber: 0,queryParam: "",sortField: "id",sortType: "desc"};
      // 桩号段id
      var sectionContractId = 3;
      //章节ID 全部章节LIST
      var chapterId = 'list';


       //分页查询桩号清单列表
      commonService.getItemizedlist(sectionContractId,chapterId,pageParam).then(function (data) {
          //console.log(data);
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
        commonService.getItemizedlist(sectionContractId,chapterId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,chapterId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,chapterId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,chapterId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,chapterId,pageParam).then(function(data){
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
        $scope.subItemized=function(){
        var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                //size: 'lg',
                templateUrl: 'template/category_second/sub_construct_contact.html',
                controller: 'subItemizedCtrl',
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
                templateUrl: 'template/category_second/create_construct_list.html',
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


 
//模态-清单
angular.module('core').controller('createContractlistCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {

  //合同....
 // 分页参数
      var pageParam = {pageSize: 5,pageNumber: 0,queryParam: "",sortField: "id",sortType: "desc"};
      // 合同段id
      var sectionContractId = 3;
      //章节ID 全部章节LIST
      var chapterId = 'list';
      //合同清单列表
      var chapterId = $scope.myValue ='list';
      commonService.getItemizedlist(sectionContractId,chapterId,pageParam).then(function(data){
        //console.log(data)
        $scope.childItemizedInfos = data;
        data.content.length==0?$scope.divShow=true:$scope.divShow=false;
      });

       //分页根据章节查询合同清单
      $scope.changeFn = function(){
        chapterId = $scope.myValue;
        pageParam.pageNumber=0;
        commonService.getItemizedlist(sectionContractId,chapterId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,chapterId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,chapterId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,chapterId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,chapterId,pageParam).then(function(data){
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
        commonService.getItemizedlist(sectionContractId,chapterId,pageParam).then(function(data){
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


        /*$scope.ok = function () {
            $uibModalInstance.close($scope.selected.item);
        };*/


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };




       $scope.idArr = [];
       
        //已选数据
        $scope.newList = [];
        $scope.changeClass = function(target){
             if (target.getAttribute("class")){
                 target.setAttribute("class","");
                 var thisID = this.item.id;
                $.each($scope.newList,function(index,item){
                  if(item.id==thisID){
                     $scope.newList.splice(index,1);
                     $scope.idArr.splice(index,1)
                     console.log($scope.idArr)
                    }
                  })
              }else{
                target.setAttribute("class","active");
                 $scope.newList.push($scope.childItemizedInfos.content[this.$index]);
                 $scope.idArr.push($scope.childItemizedInfos.content[this.$index].id)
                 console.log($scope.idArr)

           };

        };

        //选择清淡
        $scope.selectList = []
      $scope.selectOK = function(){
          $scope.selectList = $scope.newList;
          $('.modal-comp-group').css('display','none').siblings('.model-content').css('opacity',1);
        }

      $scope.selectCancel = function(){
          $('.modal-comp-group').css('display','none').siblings('.model-content').css('opacity',1);
        }



      $scope.check = function(index){
        if(this.item.contractAmount<this.myText){
          $scope.error = index;

        }else{
          $scope.error = '-1';
        }
      }
      $scope.save = function(){
        var itemizedDara = [];
         if($(".table-list input").hasClass("ng-invalid") || $(".table-list input").hasClass("errorInput")){
            $scope.isError = true;
            $timeout(function(){
                $scope.isError = false;
            },1000)
         }else{
            $(".table-list .aline").each(function(){
              if($(this).find("input").val()){
                itemizedDara.push(JSON.parse('{"key":"'+ $(this).find("input").val() +'","value":"'+ $(this).attr("listid") +'"}'));
              }
            });

            commonService.saveItemizedlist(sectionContractId,itemizedDara).then(function(data){
              //console.log(data)
            });
            $uibModalInstance.dismiss('cancel');
           
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
          $uibModalInstance.close();
          commonService.ItemizedlistClear(sectionContractId).then(function (data) {
            $scope.childItemizedInfos = data;
            //console.log(data);
        })
      };







    }])

//提交
angular.module('core').controller('subItemizedCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {


      $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
     $scope.ok = function () {
        commonService.submitItemizedlist(sectionContractId).then(function (data) {
            //console.log(data);
        })
        $uibModalInstance.close();
      };







    }])