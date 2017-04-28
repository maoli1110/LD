'use strict';
/**
 * component
 * 工程管理-工程划分-合同页面js
 */
angular.module('core').controller('projectDivisionContractCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile',
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


    }]);