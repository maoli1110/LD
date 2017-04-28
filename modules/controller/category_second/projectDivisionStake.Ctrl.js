'use strict';
/**
 * component
 * 工程管理-工程划分-桩号页面js
 */
angular.module('core').controller('projectDivisionStakeCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile) {
        //    控制左侧导航栏左右移动
        var $sliderMoving = false;
        const LEFT_DIV_WIDTH_MIN = 150;
        const LEFT_DIV_WIDTH_MAX = 200;


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

        // TODO 后台请求数据 此处先造假数据
        var data = new Array();
        for(var i=0;i<99;i++) {
            data.push("GK0+358.213~GK3+145.253土方工程构件组"+i);
        }
        $scope.items = data;
        $scope.animationsEnabled = true;
        $scope.editCompGroup = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_second/edit_comp_group.html',
                controller: 'editCompGroupCtrl',
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
    }]);

/**
 * 工程管理-工程划分-桩号-更该构件组弹框
 */
angular.module('core').controller('editCompGroupCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {
        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);