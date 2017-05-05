'use strict';
/**
 * component
 */
angular.module('core').controller('listManageContractFileUploadCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile','$filter',
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

   


    }])


