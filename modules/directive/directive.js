/**
 * Created by kylee on 2017/3/9.
 */
'use strict';
//repeat完成通知
angular.module('core').directive('repeatFinish', function ($timeout) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
});
//顶部导航栏active样式控制
angular.module('core').directive('topNav', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            $('.topNav').on('click', function () {
                $(this).addClass('active').siblings().removeClass('active');
            });
        }
    }
});
//工程管理下的导航active样式控制
angular.module('core').directive('tabActive', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            $('.tab').on('click', function () {
                $(this).addClass('active').siblings().removeClass('active');
            });
        }
    }
});

angular.module('core').directive('sideOperation', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            //合同段active样式控制
            $('.contract-name').on('click', function () {
                $(this).addClass('active').siblings().removeClass('active');
            });
            //下拉菜单arrow切换
            $('.menu').on('click', function () {
                if ($('.dropdown').hasClass('open')) {
                    $('.arrow').css({transform: 'rotate(0deg)'});
                } else {
                    $('.arrow').css({transform: 'rotate(180deg)'});
                }
                $('.dropdown-menu >li').on('click', function () {
                    $('.menu-name').text($(this).text());
                    if ($('.dropdown').hasClass('open')) {
                        $('.arrow').css({transform: 'rotate(0deg)'});
                    } else {
                        $('.arrow').css({transform: 'rotate(180deg)'});
                    }
                });
            });
        }
    }
});
//控制左侧导航栏左右移动
angular.module('core').directive('btnWrapper', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            const LEFT_DIV_WIDTH_MIN = $('.main-container').width() * 0.15;
            const LEFT_DIV_WIDTH_MAX = $('.main-container').width() * 0.2;

            let $a = $(window).height() - 70;

            $(".menu-nav").stop().animate({width: LEFT_DIV_WIDTH_MAX + 'px'}, 10);
            $(".content-wrapper").stop().animate({width: $(window).width() - LEFT_DIV_WIDTH_MAX - 4 + 'px',left: LEFT_DIV_WIDTH_MAX - 4 + 'px'}, 10);

            $(".menu-nav").height($a);
            let isClicked = true;
            $(".btn-wrapper").click(function () {
                if (isClicked) {
                    $(".menu-nav").stop().animate({width: LEFT_DIV_WIDTH_MIN + 'px'}, 500);
                    $(".content-wrapper").stop().animate({width: $(window).width() - LEFT_DIV_WIDTH_MIN - 4 + 'px',left: LEFT_DIV_WIDTH_MIN - 4 + 'px'}, 500);
                    $('.btn-wrapper>.btn-arrow').css({background: 'url(imgs/icon-button.png) -132px -31px no-repeat'});
                    isClicked = !isClicked;
                } else {
                    $(".menu-nav").stop().animate({width: LEFT_DIV_WIDTH_MAX + 'px'}, 500);
                    $(".content-wrapper").stop().animate({width: $(window).width() - LEFT_DIV_WIDTH_MAX - 4 + 'px',left: LEFT_DIV_WIDTH_MAX - 4 + 'px'}, 500);
                    $('.btn-wrapper>.btn-arrow').css({background: 'url(imgs/icon-button.png) -114px -31px no-repeat'});
                    isClicked = !isClicked;
                }
            });

            //    搜索框操作
            $('.clear').on('click', function () {
                $('.input-search').val('');
            });
        }
    }
});


//    合同附件箭头切换
angular.module('core').directive('arrowSwiper', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            var $swiper = $('.attachment');
            var $wrapper = $swiper.find(".wrapper");
            var $preBtn = $swiper.find(".arrow-left");
            var $nextBtn = $swiper.find(".arrow-right");

            var COSNT_SCROLL_ONCE = 300;
            $preBtn.click(function (e) {
                if ($wrapper.is(':animated') || $wrapper.scrollLeft() <= 0)
                    return;
                $wrapper.animate({scrollLeft: $wrapper.scrollLeft() - COSNT_SCROLL_ONCE + "px"}, 300);
            })
            $nextBtn.click(function (e) {
                // console.log($wrapper.scrollLeft(), $wrapper[0].scrollWidth, $wrapper[0].clientWidth, $wrapper[0].scrollWidth - $wrapper[0].clientWidth);
                if ($wrapper.is(':animated') || $wrapper.scrollLeft() >= $wrapper[0].scrollWidth - $wrapper[0].clientWidth)
                    return;
                $wrapper.animate({scrollLeft: $wrapper.scrollLeft() + COSNT_SCROLL_ONCE + "px"}, 300);
            })
        }
    }
});

//窗口拉伸 滚动时
angular.module('core').directive('windowResize', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            "use strict";
            window.onresize = function () {
                var H = Math.max(document.body.clientHeight, 580);
                var W = Math.max(document.body.clientWidth, 650);
                $('.menu-nav').css('height', (H - 70) + 'px');
                $('.content-wrapper').css('width', (W - $('.menu-nav').width()) + 'px');
            };
            window.onresize();
        }
    }
});


//左侧导航手风琴动效
angular.module('core').directive('according', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            //点击一级图标
            $('.project-name-span').click(function(ele){
                // debugger
                // $('.contract-list').css('display','none');
                if($(ele.target).siblings('ul').css('display')==='none'){
                    $(ele.target).siblings('ul').slideDown(300);
                } else {
                    $(ele.target).siblings('ul').slideUp(300);
                }
                $(ele.target).parent().siblings().find('ul').slideUp(300)
                
            });
            //点击二级图标
            $('.icon').click(function(ele){
                console.log(ele.target);
                // $('.tree-list').css('display','none');
                if($(ele.target).siblings('ul').css('display')==='none'){
                    $(ele.target).siblings('ul').slideDown(300);
                } else {
                    $(ele.target).siblings('ul').slideUp(300);
                }
                $(ele.target).parent().siblings().find('ul').slideUp(300)

            });
        }
    }
});











