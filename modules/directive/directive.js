/**
 * Created by kylee on 2017/3/9.
 */
'use strict';
//左侧导航项目部加载repeat完成通知
angular.module('core').directive('deptRepeatFinish', function ($timeout) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('deptNgRepeatFinished');
                });
            }
        }
    }
});
angular.module('core').directive('contractlistRepeatFinish', function ($timeout) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('contractlistNgRepeatFinished');
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

// angular.module('core').directive('sideOperation', function () {
//     return {
//         restrict: 'AE',
//         link: function (scope, element, attr) {
//             //合同段active样式控制
//             $('.contract-name').on('click', function () {
//                 $(this).addClass('active').siblings().removeClass('active');
//             });
//             //下拉菜单arrow切换
//             $('.menu').on('click', function () {
//                 if ($('.dropdown').hasClass('open')) {
//                     $('.arrow').css({transform: 'rotate(0deg)'});
//                 } else {
//                     $('.arrow').css({transform: 'rotate(180deg)'});
//                 }
//                 $('.dropdown-menu >li').on('click', function () {
//                     $('.menu-name').text($(this).text());
//                     if ($('.dropdown').hasClass('open')) {
//                         $('.arrow').css({transform: 'rotate(0deg)'});
//                     } else {
//                         $('.arrow').css({transform: 'rotate(180deg)'});
//                     }
//                 });
//             });
//         }
//     }
// });
angular.module('core').directive('sideOperation', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            //合同段active样式控制
            scope.$on('contractlistNgRepeatFinished',function(){
                 $('.contract-name > a').on('click', function () {
                    $(this).addClass('active').parent().siblings().find('>a').removeClass('active');
                });
            })
            $('.contract-name > a').on('click', function () {
                $(this).addClass('active').parent().siblings().find('>a').removeClass('active');
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
// 合同段下的树id
// var scope.ztreeOpenId = null;
var ztreeOpen = false;
var openLevel = -1; // 当前打开到第几层
/**
 * 控制左侧导航栏左右移动
 */
angular.module('core').directive('btnWrapper', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {

            let isClicked = true;
            $(".btn-wrapper").click(function () {
                const windowWidth = $(window).width();
                const LEFT_DIV_WIDTH_MIN = 6;
                const LEFT_DIV_WIDTH_MAX = 20;
                if (isClicked) {
                    $(".menu-nav").stop().animate({width: LEFT_DIV_WIDTH_MIN + 'px'}, 500);
                    $(".content-wrapper").stop().animate({width: windowWidth - LEFT_DIV_WIDTH_MIN  + 'px',left: LEFT_DIV_WIDTH_MIN  + 'px'}, 500);
                    $('.btn-wrapper>.btn-slide').css({borderRadius: '0 5px 5px 0'});
                    $('.btn-wrapper>.btn-arrow').css({background: 'url(imgs/icon-button.png) -132px -31px no-repeat'});
                    $(".contract-manage").css("display","none");
                    isClicked = !isClicked;
                } else {
                    $(".menu-nav").stop().animate({width: LEFT_DIV_WIDTH_MAX + '%'}, 500);
                    $(".content-wrapper").stop().animate({width: 100 - LEFT_DIV_WIDTH_MAX  + '%',left: LEFT_DIV_WIDTH_MAX  + '%'}, 500);
                    $('.btn-wrapper>.btn-slide').css({borderRadius: '5px 0 0 5px'});
                    $('.btn-wrapper>.btn-arrow').css({background: 'url(imgs/icon-button.png) -114px -31px no-repeat'});
                    $(".contract-manage").css("display","block");
                    isClicked = !isClicked;
                }
            });

            //搜索框清空操作
            $('#clearSecondTree').on('click', function () {
                // 当内容页也有搜索框时，用class定位会出错，故改为id定位
                $('#secondTreeInput').val('').focus();
                $('#clearSecondTree').css('display','none');
                // 展示所有节点
                if(scope.ztreeOpenId != null && ztreeOpen){
                    var treeObj = $.fn.zTree.getZTreeObj(scope.ztreeOpenId);
                    var nodes = treeObj.getNodesByParam("isHidden", true);
                    if(nodes.length>0){
                        treeObj.showNodes(nodes);
                    }
                }
            });
            //搜索框搜素操作
            $('#searchSecondTree').on('click', function () {
                // zTree没有展开 不执行搜索功能
                if(scope.ztreeOpenId == null || !ztreeOpen){
                    return;
                }
                // 搜索前展示所有节点
                var treeObj = $.fn.zTree.getZTreeObj(scope.ztreeOpenId);
                var nodes = treeObj.getNodesByParam("isHidden", true);
                if(nodes.length>0){
                    treeObj.showNodes(nodes);
                }
                var searchKey = $('.input-search').val();
                var treeNodes = treeObj.transformToArray(treeObj.getNodes());
                // 隐藏不符合搜索条件的节点
                for (var i = 0;i < treeNodes.length; i++) {
                    if(!treeNodes[i].name.indexOf(searchKey)) {
                        treeObj.hideNode(treeNodes[i]);
                    }
                }
            });
        }
    }
});


//    合同附件箭头切换
angular.module('core').directive('arrowSwiper', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {

            arrowSwiper('attachment','wrapper','arrow-left','arrow-right');
            
            arrowSwiper('attachment','attachment-wrapper','attachment-arrow-left','attachment-arrow-right');
            
            function arrowSwiper(swiper,wrapper,left,right) {

                var $swiper = $('.'+swiper);
                var $wrapper = $swiper.find("."+wrapper);
                var $preBtn = $swiper.find("."+left);
                var $nextBtn = $swiper.find("."+right);
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


// 日期控件时间选择
angular.module('core').directive('datePicker', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            "use strict";
            $('.form_date').datetimepicker({
                language:  'zh-CN',
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0
            });
        }
    }
});

// 删除附件
angular.module('core').directive('deleteAttachment', function ($uibModal) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            scope.deleteAttachmentModal = function () {
                var modalInstance = $uibModal.open({
                    animation: scope.animationsEnabled,
                    // size: 'sm',
                    templateUrl: 'template/category_first/modal_delete_constract.html',
                    controller: 'ModalCtrl',
                    resolve: {
                        items: function () {
                            return scope.items;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    scope.selected = selectedItem;
                }, function () {

                });
            };
        }
    }
});
//左侧导航手风琴动效
angular.module('core').directive('accordingRepeat', function ($timeout) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            //点击一级图标
            scope.$on('deptNgRepeatFinished',function(){
                $('.project-name-span').click(function(ele){
                    if($(ele.target).siblings('ul').css('display')==='none'){
                        $(ele.target).siblings('ul').slideDown(300);
                    } else {
                        $(ele.target).siblings('ul').slideUp(300);
                    }
                    $(ele.target).parent().siblings().find('>ul').slideUp(300);
                    
                });
               
            });
            //点击二级图标(监听name的变化)
            scope.$watch('flag.contractListRepeat',function(newValue){
                $('.icon').click(function(ele){
                    var tree = $(ele.target).parent().siblings('ul');
                    if(tree.css('display')==='none'){
                        tree.slideDown(300);
                        $(ele.target).removeClass('state-down').addClass('state-up');
                        ztreeOpen = true;
                        scope.ztreeOpenId = tree.attr("id");
                    } else {
                        debugger
                        tree.slideUp(300);
                         $(ele.target).removeClass('state-up').addClass('state-down');
                        ztreeOpen = false;
                    }
                    $(ele.target).parent().parent().siblings().find('>ul').slideUp(300);
                    $(ele.target).parent().parent().siblings().find('.icon').removeClass('state-up').addClass('state-down');
                });
            });

            $('#expand').click(function(ele){   // 展开树节点
                if(!ztreeOpen) {
                    return;
                }
                var treeObj = $.fn.zTree.getZTreeObj(scope.ztreeOpenId);
                var treeNodes = treeObj.transformToArray(treeObj.getNodes());
                var maxLevel=-1;	// 该树的最大层数

                for (var i = 0;i < treeNodes.length; i++) {
                    if(treeNodes[i].open && openLevel<treeNodes[i].level){  // 获取当前展开到第几层
                        openLevel = treeNodes[i].level;
                    }
                    if (treeNodes[i].level >= maxLevel) {	// 获取状态树的深度
                        maxLevel = treeNodes[i].level;
                    }
                }
                if(openLevel < maxLevel){
                    for (var i = 0;i < treeNodes.length; i++) {
                        if (treeNodes[i].level == openLevel && treeNodes[i].isParent) {
                            treeObj.expandNode(treeNodes[i], true, false, null, true);
                        }
                    }
                    openLevel++;
                }
            });
            $('#collapse').click(function(ele){   // 收起树节点
                if(!ztreeOpen) {
                    return;
                }
                openLevel = -1; // 当前打开到第几层
                var treeObj = $.fn.zTree.getZTreeObj(scope.ztreeOpenId);
                var treeNodes = treeObj.transformToArray(treeObj.getNodes());
                for (var i = 0;i < treeNodes.length; i++) {  // 获取当前展开到第几层
                    if(treeNodes[i].open && openLevel<treeNodes[i].level && treeNodes[i].isParent){
                        openLevel = treeNodes[i].level;
                    }
                }
                for (var i = 0;i < treeNodes.length; i++) {
                    if (treeNodes[i].level == openLevel) {
                        treeObj.expandNode(treeNodes[i], false, false, null, true);
                    }
                }
            });

        }
    }
});

angular.module('core').directive('inputSearch', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            $('.input-search').bind('input porpertychange', function (element) {
                if($('.input-search').val().length > 0) {
                    $(element.target).next().css('display','inline-block');
                } else {
                    $(element.target).next().css('display','none');
                }
            });
        }
    }
});