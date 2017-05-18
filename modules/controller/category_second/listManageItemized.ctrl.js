'use strict';
/**
 * component
 */
angular.module('core').controller('listManageItemizedCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile','$filter','$state',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile,$filter,$state) { 
      
      // 分页参数
      var pageParam = {pageSize: 20,pageNumber: 0,queryParam: "",sortField: "id",sortType: "desc"};
      // 桩号段id 
      // $scope.sectionContractId = 3;
      //章节ID 全部章节LIST
      var chapterId = 'list';
      $scope.stakeInfo;


      // 如果刷新的地址是ld.listManageItemized 则转到ld.listManageContract
        if($scope.stakeInfo == null && $state.$current.name === 'ld.listManageItemized') {
            $state.go('ld.listManageContract');
            return;
        }
        //点击左侧树节点对应的桩号(sendCtrl->projectDivisionStakeCtrl父子通信)
        $scope.$on('to-listManageItemized',function(event,stakeInfo, ppid){
            $scope.stakeInfo = stakeInfo;
            commonService.findChildItemizedDetail($scope.stakeInfo.treeId).then(function(data){

                $scope.stakeInfo.childItemId = data.data.id;    // 内容页该子分项工程的id
                if(!$scope.stakeInfo.childItemId){$scope.childItemizedInfos=[];}
                //获取清单分页列表
                pageParam.pageNumber=0;
                //console.log($scope.stakeInfo.childItemId)
                commonService.Itemizedlist($scope.stakeInfo.childItemId,chapterId,pageParam).then(function(data){
                  $scope.childItemizedInfos =data ;
                  });
            });
            $scope.$apply();
        });
        // 获取子分项工程的明细信息(桩号、合同图号、已关联构件组、发起时间)
        if($scope.stakeInfo != null) {
            commonService.findChildItemizedDetail($scope.stakeInfo.treeId).then(function(data){
                $scope.stakeInfo.childItemId = data.data.id;    // 内容页该子分项工程的id
                if(!$scope.stakeInfo.childItemId){$scope.childItemizedInfos=[];}
                //获取清单分页列表
                pageParam.pageNumber=0;
                commonService.Itemizedlist($scope.stakeInfo.childItemId,chapterId,pageParam).then(function(data){
                  
                  $scope.childItemizedInfos =data ;
                  });
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
        commonService.Itemizedlist($scope.stakeInfo.childItemId,chapterId,pageParam).then(function(data){
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
        commonService.Itemizedlist($scope.stakeInfo.childItemId,chapterId,pageParam).then(function(data){
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
        commonService.Itemizedlist($scope.stakeInfo.childItemId,chapterId,pageParam).then(function(data){
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
        commonService.Itemizedlist($scope.stakeInfo.childItemId,chapterId,pageParam).then(function(data){
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
        commonService.Itemizedlist($scope.stakeInfo.childItemId,chapterId,pageParam).then(function(data){
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
        if(!($scope.childItemizedInfos.content)){
              alert("无数据！");
              return false;
            }
        var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                //size: 'lg',
                templateUrl: 'template/category_second/del_construct_contact.html',
                controller: 'clearItemizedlistCtrl',
                resolve: {
                    items: function () {
                        return $scope.stakeInfo.childItemId;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.childItemizedInfos={"content":[],"totalElements":0,"totalPages":0,"number":1}
            }, function () {
                //console.info('Modal dismissed at: ' + new Date());
            });

      }


        //提交清单
        $scope.subItemized=function(){
        if(!($scope.childItemizedInfos.content)){
          alert("无数据！");
          return false;
        }
        var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                //size: 'lg',
                templateUrl: 'template/category_second/sub_construct_contact.html',
                controller: 'subItemizedCtrl',
                resolve: {
                    items: function () {
                        return $scope.stakeInfo.childItemId;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                //$scope.selected = selectedItem;
            }, function () {
                //console.info('Modal dismissed at: ' + new Date());
            });

      }

      //导出桩号清单

      $scope.DownloadItemizedlist = function(){

        if(!($scope.childItemizedInfos.content)){
          alert("无数据！");
          return false;
        }
        commonService.downloadItemizedlist($scope.stakeInfo.childItemId).then(function(data){
          //console.log(data);
        });
        
      }



    $scope.animationsEnabled = true;
    //编辑
    $scope.createContractlist = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_second/create_construct_list.html',
                controller: 'createContractlistModalCtrl',
                resolve: {
                    items: function () {
                        //子分项ID and 合同ID
                        return {"itemid":$scope.stakeInfo.childItemId,"contractId":$scope.stakeInfo.contractId};
                    }
                }
            });
            modalInstance.result.then(function (list) {
                //保存后页面刷新
                commonService.Itemizedlist($scope.stakeInfo.childItemId,chapterId,pageParam).then(function(data){
                  $scope.childItemizedInfos =data ;
                  });


            }, function () {
                //console.info("取消")
            });
        };
  
  }])


 
//模态-编辑
angular.module('core').controller('createContractlistModalCtrl', ['$uibModal','$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($uibModal,$scope, $http, $uibModalInstance, items, $timeout, commonService) {
      //子分项ID
      $scope.stakeInfo ={"childItemId":items.itemid};
      //不分页，获取全部数据
      var pageParam = {};
      $scope.idArr=[]

      //选中列表
      commonService.Itemizedlist($scope.stakeInfo.childItemId,"list",pageParam).then(function(data){
          //当前选中LIST
          $scope.newList =data.content;
          //当前选中项ID
          $.each($scope.newList,function(index,item){
                 $scope.idArr.push(item.id)
              })

          });

      //删除当前已选择，更新数据
      $scope.delList = function(index){
        $scope.idArr.splice(index,1);
        $scope.newList.splice(index,1);
      }

      //选择清单
      $scope.selectItemizedModal = function () {
            //传入清单选择页面：子分项id；已选中id; 合同段id；
            var sendInfos = {"childItemId":$scope.stakeInfo.childItemId,"selectedId":$scope.idArr,"contractId":items.contractId,"newList":$scope.newList}
            var modalInstance = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: 'template/category_second/modal_select_itemized.html',
                controller: 'selectItemizedModalCtrl',
                resolve: {
                    items: function () {
                       return sendInfos;
                    }
                }
            });
            modalInstance.result.then(function (list) {
                $scope.newList = list;
               // $scope.childItemizedInfos ={"content":list,"totalElements":list.length,"totalPages":1,"number":list.length?1:0};
            }, function () {
                //console.info("取消")
            });
        };

         $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        //校验-保存并且更新页面数据
        $scope.save = function(){
         var itemizedData = [];
         if($(".table-list input").hasClass("ng-invalid") || $(".table-list input").hasClass("errorInput")){
            $scope.isError = true;
            $timeout(function(){
                $scope.isError = false;
            },1000)
         }else{
            $(".mytable .aline").each(function(index,value){
              itemizedData.push(JSON.parse('{"value":"'+ ($(value).find("input").val()?$(value).find("input").val():'') +'","key":"'+ $(value).attr("listid") +'"}'));
            });
            //console.log(itemizedData)
            commonService.saveItemizedlist($scope.stakeInfo.childItemId,itemizedData).then(function(data){
               $uibModalInstance.close();
            });
            
           
         }

      }

      $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };

        


    }])


//选择清单模态框-选择清单
angular.module('core').controller('selectItemizedModalCtrl', ['$uibModal','$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($uibModal,$scope, $http, $uibModalInstance, items, $timeout, commonService) {

        //查询清单桩号章节
        var pageParam = {"pageSize": 5,"pageNumber": 0,"queryParam": "","sortField": "","sortType": ""};
        //章节ID 全部章节LIST
        //合同清单列表
        //items:{"childItemId":$scope.stakeInfo.childItemId,"selectedId":$scope.idArr,"contractId":items.contractId}
        //合同段ID 
        $scope.stakeInfo={"childItemId":items.contractId}
        $scope.idArr = items.selectedId;
        $scope.newList = items.newList || [];

        
        var chapterId = $scope.myValue ='list';
        commonService.contractlistSubmittedChapters($scope.stakeInfo.childItemId).then(function (data) {
          $scope.chapters = data;
        })
       //查询清单桩号列表（已提交的）
        commonService.contractlistSubmittedList($scope.stakeInfo.childItemId,chapterId,pageParam).then(function(data){
          console.log(data)
          $scope.childItemizedInfos = data;
        });

       //分页根据章节查询合同清单（已提交的）
      $scope.changeFn = function(){
        chapterId = $scope.myValue;
        pageParam.pageNumber=0;
        commonService.contractlistSubmittedList($scope.stakeInfo.childItemId,chapterId,pageParam).then(function(data){
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
        commonService.contractlistSubmittedList($scope.stakeInfo.childItemId,chapterId,pageParam).then(function(data){
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
        commonService.contractlistSubmittedList($scope.stakeInfo.childItemId,chapterId,pageParam).then(function(data){
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
        commonService.contractlistSubmittedList($scope.stakeInfo.childItemId,chapterId,pageParam).then(function(data){
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
        commonService.contractlistSubmittedList($scope.stakeInfo.childItemId,chapterId,pageParam).then(function(data){
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
        commonService.contractlistSubmittedList($scope.stakeInfo.childItemId,chapterId,pageParam).then(function(data){
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

      //选择清单
        $scope.selectOK = function(){
          console.log($scope.newList)
          $uibModalInstance.close($scope.newList);
          //console.log( $scope.newList)
        }


      $scope.check = function(index){
        if(this.item.contractAmount){
          if(this.item.contractAmount<=this.myText){
             $scope['error'+index] = index;
            }else{
              $scope['error'+index] = '-1';
            }
        }else{
            if(this.myText){
              $scope['error'+index] = index;
            }else{
              $scope['error'+index] = '-1';
            }
        }
      }
      $scope.validate = function(index){
        if(index == $scope['error'+index]){
          return 'errorInput';
        }else{
          return ''
        }
      }

        //已选数据
        console.log($scope.newList)
        $scope.changeClass = function(target){
             if (target.getAttribute("class")){
                 target.setAttribute("class","");
                 var thisID = this.item.id;
                $.each($scope.newList,function(index,value){
                  if(value){
                      if(thisID==value.id){
                       $scope.newList.splice(index,1);
                       $scope.idArr.splice(index,1);
                       //console.log($scope.idArr)
                      }
                     }
                  })
              }else{
                target.setAttribute("class","active");
                 $scope.newList.push($scope.childItemizedInfos.content[this.$index]);
                 $scope.idArr.push($scope.childItemizedInfos.content[this.$index].id);
           };

        };


 $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };











    }])





//清空桩号清单
angular.module('core').controller('clearItemizedlistCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {
      $scope.stakeInfo={"childItemId":items}
      $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
     $scope.ok = function () {
          console.log($scope.stakeInfo.childItemId)
          commonService.ItemizedlistClear($scope.stakeInfo.childItemId).then(function (data) {
              $uibModalInstance.close();
        })
      };

    }])

//提交
angular.module('core').controller('subItemizedCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {
      //子分项ID
      $scope.stakeInfo = {"childItemId":items};
      $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
     $scope.ok = function () {
         console.log($scope.stakeInfo.childItemId)
        commonService.submitItemizedlist($scope.stakeInfo.childItemId).then(function (data) {
            $uibModalInstance.close();
            //console.log(data);
        })
        
      };







    }])