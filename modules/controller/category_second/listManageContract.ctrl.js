'use strict';
/**
 * component
 */
angular.module('core').controller('listManageContractCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile','$filter',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile,$filter) {
       
    $scope.animationsEnabled = true;

    let isClicked = true;
    $(".btn-wrapper").click(function () {
        if (isClicked) {
            $(".menu-nav").stop().animate({width: LEFT_DIV_WIDTH_MIN + 'px'}, 500);
            $(".content-wrapper").stop().animate({width: $(window).width() - LEFT_DIV_WIDTH_MIN - 4 + 'px'}, 500);
            $('.btn-wrapper>.btn-arrow').css({background: 'url(imgs/icon-button.png) -132px -31px no-repeat'});
            isClicked = !isClicked;
        } else {
            $(".menu-nav").stop().animate({width: LEFT_DIV_WIDTH_MAX + 'px'}, 500);
            $(".content-wrapper").stop().animate({width: $(window).width() - LEFT_DIV_WIDTH_MAX - 4 + 'px'}, 500);
            $('.btn-wrapper>.btn-arrow').css({background: 'url(imgs/icon-button.png) -114px -31px no-repeat'});
            isClicked = !isClicked;
        }
    });

    $('.clear').on('click', function () {
        $('.input-search').val('');
    });

    $scope.checkModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_second/create_construct_contract.html',
                controller: 'ModalCtrl',
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

   $scope.dataList = [ {"a":"2002200","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"2550022","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"5666333","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"8877555","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"1122555","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"6996330","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"7885999","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"0025336","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"5885522","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"5885522","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"5885522","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"5885522","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"5885522","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"5885522","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"5885522","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"5885522","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"5885522","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                       {"a":"5885522","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"}]
    $scope.dataListOld = $scope.dataList;

    $scope.fnFilter = function(){

        $scope.dataList = $filter("filter")($scope.dataListOld,$scope.filterVal);
    }
    $scope.fnKeydown = function(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                $scope.fnFilter();
            }
        };
    $scope.arglist = [];
    $scope.fnSort = function(arg){

        $scope.arglist[arg]=!$scope.arglist[arg]
        $scope.dataList = $filter("orderBy")($scope.dataList,arg,$scope.arglist[arg])
    }
	
	}])



 
//模态框里的
angular.module('core').controller('ModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items
        };

        $scope.btnClose = function(){
            $scope.input1="";
        }


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
       $scope.dataList = [ {"a":"2002200","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                           {"a":"2002200","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                           {"a":"2002200","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                           {"a":"2002200","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                           {"a":"2002200","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                           {"a":"2002200","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                           {"a":"2002200","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                           {"a":"2002200","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"},
                           {"a":"2002200","b":"路基工程","c":"m3","d":"7.77556","e":"2225552.55864","f":"98555.66"}]



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
