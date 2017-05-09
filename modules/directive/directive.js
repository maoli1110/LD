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

angular.module('core').directive('contractFilesRepeatFinish', function ($timeout) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('contractFilesNgRepeatFinished');
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
            scope.$on('contractlistNgRepeatFinished', function () {
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

            btnClickSlide($(".menu-nav"), $(".content-wrapper"), $(".contract-manage"), $(".btn-wrapper"), $('.btn-slide'), $('.btn-arrow'), $(window));
            btnClickSlide($(".preview-menu"), $(".preview-wrapper"), $(".file-wrapper"), $('.button-wrapper'), $('.btn-left'), $('.btn-right'), $('.modal-content'));

            function btnClickSlide(menuNav, contentWrapper, innerMenu, btnWrapper, btnSlide, btnArrow, outer) {
                btnWrapper.click(function () {
                    const outerWidth = outer.width();
                    const LEFT_DIV_WIDTH_MIN = 6;
                    const LEFT_DIV_WIDTH_MAX = 20;
                    if (isClicked) {
                        menuNav.stop().animate({width: LEFT_DIV_WIDTH_MIN + 'px'}, 500);
                        contentWrapper.stop().animate({
                            width: outerWidth - LEFT_DIV_WIDTH_MIN + 'px',
                            left: LEFT_DIV_WIDTH_MIN + 'px'
                        }, 500);
                        btnSlide.css({borderRadius: '0 5px 5px 0'});
                        btnArrow.css({background: 'url(imgs/icon-button.png) -132px -31px no-repeat'});
                        innerMenu.css("display", "none");
                        isClicked = !isClicked;
                    } else {
                        menuNav.stop().animate({width: LEFT_DIV_WIDTH_MAX + '%'}, 500);
                        contentWrapper.stop().animate({
                            width: 100 - LEFT_DIV_WIDTH_MAX + '%',
                            left: LEFT_DIV_WIDTH_MAX + '%'
                        }, 500);
                        btnSlide.css({borderRadius: '5px 0 0 5px'});
                        btnArrow.css({background: 'url(imgs/icon-button.png) -114px -31px no-repeat'});
                        innerMenu.css("display", "block");
                        isClicked = !isClicked;
                    }
                });
            }

            //搜索框清空操作
            $('#clearSecondTree').on('click', function () {
                // 当内容页也有搜索框时，用class定位会出错，故改为id定位
                $('#secondTreeInput').val('').focus();
                $('#clearSecondTree').css('display', 'none');
                // 展示所有节点
                if (scope.ztreeOpenId != null && ztreeOpen) {
                    var treeObj = $.fn.zTree.getZTreeObj(scope.ztreeOpenId);
                    var nodes = treeObj.getNodesByParam("isHidden", true);
                    if (nodes.length > 0) {
                        treeObj.showNodes(nodes);
                    }
                }
            });
            //搜索框搜素操作
            $('#searchSecondTree').on('click', function () {
                // zTree没有展开 不执行搜索功能
                if (scope.ztreeOpenId == null || !ztreeOpen) {
                    return;
                }
                // 搜索前展示所python -m SimpleHTTPServer 8080有节点
                var treeObj = $.fn.zTree.getZTreeObj(scope.ztreeOpenId);
                var nodes = treeObj.getNodesByParam("isHidden", true);
                if (nodes.length > 0) {
                    treeObj.showNodes(nodes);
                }
                var searchKey = $('.input-search').val();
                var treeNodes = treeObj.transformToArray(treeObj.getNodes());
                var otherNeedShowNodes = new Array();
                // 隐藏不符合搜索条件的节点
                for (var i = 0; i < treeNodes.length; i++) {
                    if (treeNodes[i].name.indexOf(searchKey) < 0) {
                        treeObj.hideNode(treeNodes[i]);
                    } else {
                        // 如果父节点没有隐藏 父节点下的子节点也要显示
                        getZtreeChildNode(treeNodes[i], otherNeedShowNodes);
                        // 获取当前节点的所有父节点 显示
                        getZtreeParentNode(treeNodes[i], otherNeedShowNodes);
                    }
                }
                if (otherNeedShowNodes.length > 0) {
                    treeObj.showNodes(otherNeedShowNodes);
                }
            });
        }
    }
});

/**
 * 递归获取ztree类型节点下的所有子节点
 * @param ztreeNode
 * @param nodes
 */
function getZtreeChildNode(ztreeNode, nodes){
    if (!ztreeNode.isParent){
        return;
    }
    var children = ztreeNode.children;
    if(children.length > 0){
        for(var i = 0; i < children.length; i++){
            var child = children[i];
            if(nodes.indexOf(child) < 0) {
                nodes.push(child);
            }
            getZtreeChildNode(child, nodes);
        }
    }
}

/**
 * 递归获取ztree类型节点下的所有父节点
 * @param ztreeNode
 * @param nodes
 */
function getZtreeParentNode(ztreeNode, nodes){
    var pNode = ztreeNode.getParentNode();
    if(pNode != null) {
        if(nodes.indexOf(pNode) < 0) {
            nodes.push(pNode);
        }
        getZtreeParentNode(pNode, nodes);
    }
}


//    合同附件箭头切换
angular.module('core').directive('arrowSwiper', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {

            arrowSwiper('attachment', 'wrapper', 'arrow-left', 'arrow-right');

            arrowSwiper('attachment', 'attachment-wrapper', 'attachment-arrow-left', 'attachment-arrow-right');

            function arrowSwiper(swiper, wrapper, left, right) {

                var $swiper = $('.' + swiper);
                var $wrapper = $swiper.find("." + wrapper);
                var $preBtn = $swiper.find("." + left);
                var $nextBtn = $swiper.find("." + right);
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
                language: 'zh-CN',
                weekStart: 1,
                todayBtn: 1,
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
                    templateUrl: 'template/category_first/modal_delete_attachment.html',
                    controller: 'deleteAttachmentModal',
                    resolve: {
                        items: function () {
                            return scope.items;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    // scope.selected = selectedItem;
                });
            };
            
            $('.btn-upload').on('click',function () {
                
            });
        }
    }
});
//左侧导航手风琴动效
angular.module('core').directive('accordingRepeat', function ($timeout) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            //点击一级图标
            scope.$on('deptNgRepeatFinished', function () {
                $('.project-name-span').click(function (ele) {
                    if ($(ele.target).siblings('ul').css('display') === 'none') {
                        $(ele.target).siblings('ul').slideDown(300);
                    } else {
                        $(ele.target).siblings('ul').slideUp(300);
                    }
                    $(ele.target).parent().siblings().find('>ul').slideUp(300);

                });

            });
            //点击二级图标(监听name的变化)
            scope.$watch('flag.contractListRepeat', function (newValue) {
                $('.icon').click(function (ele) {
                    var tree = $(ele.target).parent().siblings('ul');
                    if (tree.css('display') === 'none') {
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

            $('#expand').click(function (ele) {   // 展开树节点
                if (!ztreeOpen) {
                    return;
                }
                var treeObj = $.fn.zTree.getZTreeObj(scope.ztreeOpenId);
                var treeNodes = treeObj.transformToArray(treeObj.getNodes());
                var maxLevel = -1;	// 该树的最大层数

                for (var i = 0; i < treeNodes.length; i++) {
                    if (treeNodes[i].open && openLevel < treeNodes[i].level) {  // 获取当前展开到第几层
                        openLevel = treeNodes[i].level;
                    }
                    if (treeNodes[i].level >= maxLevel) {	// 获取状态树的深度
                        maxLevel = treeNodes[i].level;
                    }
                }
                if (openLevel < maxLevel) {
                    for (var i = 0; i < treeNodes.length; i++) {
                        if (treeNodes[i].level == openLevel && treeNodes[i].isParent) {
                            treeObj.expandNode(treeNodes[i], true, false, null, true);
                        }
                    }
                    openLevel++;
                }
            });
            $('#collapse').click(function (ele) {   // 收起树节点
                if (!ztreeOpen) {
                    return;
                }
                openLevel = -1; // 当前打开到第几层
                var treeObj = $.fn.zTree.getZTreeObj(scope.ztreeOpenId);
                var treeNodes = treeObj.transformToArray(treeObj.getNodes());
                for (var i = 0; i < treeNodes.length; i++) {  // 获取当前展开到第几层
                    if (treeNodes[i].open && openLevel < treeNodes[i].level && treeNodes[i].isParent) {
                        openLevel = treeNodes[i].level;
                    }
                }
                for (var i = 0; i < treeNodes.length; i++) {
                    if (treeNodes[i].level == openLevel) {
                        treeObj.expandNode(treeNodes[i], false, false, null, true);
                    }
                }
            });

        }
    }
});

/**
 * 第二种左侧树搜索框 X 按钮显隐控制
 */
angular.module('core').directive('inputSearch', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            $('.input-search').bind('input porpertychange', function (element) {
                if ($('.input-search').val().length > 0) {
                    $(element.target).next().css('display', 'inline-block');
                } else {
                    $(element.target).next().css('display', 'none');
                }
            });
        }
    }
});

/**
 * 工程管理-工程划分-合同段搜索框 X 按钮显示控制
 * 工程管理-工程划分-桩号-更改构件组搜索框 X 按钮显示控制
 */
angular.module('core').directive('inputSearchChildItems', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            $('#searchChildItemsValue').bind('input porpertychange', function (element) {
                if ($('#searchChildItemsValue').val().length > 0) {
                    $(element.target).next().css('display', 'inline-block');
                } else {
                    $(element.target).next().css('display', 'none');
                }
            });
        }
    }
});

// 下拉菜单切换控制
angular.module('core').directive('constractManageDropDownControll', function (commonService) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            var modalMap = {};
            // 页面下拉菜单控制
            function onClick(buttonID, templateID, btnNone,constractId,attachmentID) {
                $('#' + buttonID).css('display', 'inline-block');
                var btnNone = btnNone.split(',');
                btnNone.forEach(function (i, v) {
                    $('#' + i).css('display', 'none');
                });
                $('#' + templateID).css('display', 'inline-block').siblings().css('display', 'none');
                $('#' + attachmentID).css('display', 'block').siblings('.attachment').css('display', 'none');
                $('#' + constractId).css('display', 'block').siblings().css('display', 'none');
            }

            $('.dropdown-menu li').on('click', function () {
                var buttonID = $(this).attr('buttonID');
                var templateID = $(this).attr('templateID');
                var attachmentID = $(this).attr('attachmentID');
                var constractId = $(this).attr('constractId');
                var btnNone = $(this).attr('btnNone');
                onClick(buttonID, templateID, btnNone,constractId,attachmentID);
                modalMap.buttonID = buttonID;
                var $name = $(this).text();
                switch ($name) {
                    case '施工合同':
                        //获取项目部下施工合同段
                        scope.getContractList = function (deptId) {
                            commonService.getContractList(deptId).then(function (data) {
                                scope.contractList = data.data;
                            });
                        };
                        break;
                    case '监理合同':
                        //获取项目部下监理合同段
                        scope.getSupervisionList = function (deptId) {
                            commonService.getSupervisionList(deptId).then(function (data) {
                                scope.contractList = data.data;
                            });
                        };
                        break;
                    case '监理试验室合同':
                        //获取项目部下监理试验室合同段
                        scope.getSupervisionLaboratoryList = function (deptId) {
                            commonService.getSupervisionLaboratoryList(deptId).then(function (data) {
                                scope.contractList = data.data;
                            });
                        }
                        break;
                    default :
                        //获取项目部下施工合同段
                        scope.getContractList = function (deptId) {
                            commonService.getContractList(deptId).then(function (data) {
                                scope.contractList = data.data;
                            });
                        };
                        break;
                }
            });
            // console.log(11111);

            $('.edit-contract').on('click', function (e) {
                e.preventDefault();
                var $select = $(".selectProject");

                if ($select.length == 0) {
                    alert('请选择一个合同');
                    return;
                }
                switch (modalMap.buttonID) {
                    case "createConstructModal":
                        $(this).attr('ng-click', scope.editConstructModal());
                        break;
                    case "createSuperviseModal":
                        $(this).attr('ng-click', scope.editSuperviseModal());
                        break;
                    case "createLabModal":
                        $(this).attr('ng-click', scope.editLabModal());
                        break;
                    default:
                        $(this).attr('ng-click', scope.editConstructModal());
                        break;
                }
            });
            // 删除合同和编辑合同控制请选中一个合同
            $('.attachment .attachment-operate').on("click", function () {
                selectProject(this);
            });
            function selectProject(element) {
                $(".selectProject").removeClass("selectProject");
                $(element).addClass("selectProject");
            }


            $('#delete-contract').on('click', function () {
                var $select = $(".selectProject");
                if ($select.length == 0) {
                    alert('请选择一个合同');
                    return;
                }
                $(this).attr('ng-click', scope.deleteModal());

            });
        }
    }
})