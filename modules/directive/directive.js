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
                    if(!scope.flag.deptRepeatFinish){
                        scope.$emit('deptNgRepeatFinished');
                    }
                    scope.flag.deptRepeatFinish = true;
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
                    $('.menu-name').attr('class', 'menu-name ' + $(this).attr('id'));
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
            let menuNav
            $(".menu-nav").each(function(){
                if($(this).css('display') !== 'none'){
                    menuNav = $(this);
                }
            })
            btnClickSlide(menuNav, $(".content-wrapper"), $(".contract-manage"), $(".btn-wrapper"), $('.btn-slide'), $('.btn-arrow'), $(window));
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
                    if (treeNodes[i].nodeName.indexOf(searchKey) < 0) {
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
    if(children != null && children.length > 0) {
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
function getZtreeParentNode(ztreeNode, nodes) {
    var pNode = ztreeNode.getParentNode();
    if (pNode != null) {
        if (nodes.indexOf(pNode) < 0) {
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
                $('.menu-nav').each(function(){
                    if($(this).css('display') !== 'none'){
                        $('.menu-nav').css('height', (H - 70) + 'px');
                        $('.content-wrapper').css('width', (W - $(this).width()) + 'px');
                    }
                });
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
                            return {};
                        }
                    }
                });
                modalInstance.result.then(function () {
                    // scope.selected = selectedItem;
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
            $('#secondTreeInput').bind('input porpertychange', function (element) {
                // 当内容页也有搜索框时，用class定位会出错，故改为id定位
                if ($('#secondTreeInput').val().length > 0) {
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
                    //$('#clearSearchKey').css('display', 'inline-block');

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
            function onClick(buttonID, templateID, btnNone, constractId, attachmentID) {
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
                onClick(buttonID, templateID, btnNone, constractId, attachmentID);
                modalMap.buttonID = buttonID;
               
            });

            //编辑合同点击合同段号
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

            scope.getCurrentClickItem = function (deptId, ele) {
                // function select(ele) {
                //     $(".select").removeClass("select");
                //     $(ele).addClass("select");
                // }
                // select(ele);

                var $name = $('.menu-name').text();
                switch ($name) {
                    case '施工合同':
                        //获取项目部下施工合同段
                        commonService.getContractList(deptId).then(function (data) {
                            scope.contractList = data.data;
                        });
                        break;
                    case '监理合同':
                        //获取项目部下监理合同段
                        commonService.getSupervisionList(deptId).then(function (data) {
                            scope.contractList = data.data;
                        });
                        break;
                    case '监理试验室合同':
                        //获取项目部下监理试验室合同段
                        commonService.getSupervisionLaboratoryList(deptId).then(function (data) {
                            scope.contractList = data.data;
                        });
                        break;
                    default:
                        //获取项目部下施工合同段
                        commonService.getContractList(deptId).then(function (data) {
                            scope.contractList = data.data;
                        });
                        break;
                }
            }

            //删除合同点击合同段号
            $('#delete-contract').on('click', function () {
                var $select = $(".selectProject");
                if ($select.length == 0) {
                    alert('请选择一个合同');
                    return;
                }

                switch (modalMap.buttonID) {
                    case "createConstructModal":
                        $(this).attr('ng-click', scope.deleteConstractModal());
                        break;
                    case "createSuperviseModal":
                        $(this).attr('ng-click', scope.deleteSupervisionModal());
                        break;
                    case "createLabModal":
                        $(this).attr('ng-click', scope.deleteSupervisionLabModal());
                        break;
                    default:
                        $(this).attr('ng-click', scope.deleteConstractModal());
                        break;
                }

            });
            //新建合同选择项目
            $('.btn-create').on('click', function () {
                var $select = $(".select");
                if ($select.length == 0) {
                    alert('请选择一个项目');
                    return;
                }
                switch (modalMap.buttonID) {
                    case "createConstructModal":
                        $(this).attr('ng-click', scope.createConstructModal());
                        break;
                    case "createSuperviseModal":
                        $(this).attr('ng-click', scope.createSuperviseModal());
                        break;
                    case "createLabModal":
                        $(this).attr('ng-click', scope.createLabModal());
                        break;
                    default:
                        $(this).attr('ng-click', scope.createConstructModal());
                        break;
                }

            });
        }
    }
})

// 上传附件upload
angular.module('core').directive('uploadFiles', function (FileUploader, $timeout) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            var basePath = "http://192.168.13.215:8080/LBLD/",
                popStateNum = 0;

            var docSelectedList1 = [];
            scope.uploadDocList = [];		//上传资料list
            scope.onCompleteAllSignal = false; //是否上传成功signal
            scope.uploadErrorSignal = false; //是否上传成功signal
            scope.docsUploadList = [];
            // scope.docSelectedList = []; 	//本地上传文件
            var uploader = scope.uploader = new FileUploader({
                url: basePath + 'fileupload/upload.do'
                // queueLimit:30
            });

            scope.marker = {
                docsRepeatMind: false
            };

            //FILTERS
            uploader.filters.push({
                name: 'customFilter',
                fn: function (item /*{File|FileLikeObject}*/, options) {
                    scope.docsUploadList.push(item);
                    popStateNum++;
                    if (scope.docsUploadList.length > 5) {
                        if (!scope.marker.docsRepeatMind) {
                            layer.alert('上传资料不能多于5个！', {
                                closeBtn: 0,
                                move: false
                            });
                        }
                        scope.marker.docsRepeatMind = true;
                        return this.queue.length < 5;
                    }
                    return this.queue.length < 5;
                }
            });

            //点击上传资料按钮
            scope.docsUpload = function () {
                scope.marker.docsRepeatMind = false;
                $('.upload-docs').attr('uploader', 'uploader');
                $('.upload-docs').attr('nv-file-select', '');
                $('.upload-docs').click();
            }

            

            scope.deleteCurrentAttachment = function (ele,item) {
                function select(ele) {
                    $(".deleteSelect").removeClass("deleteSelect");
                    $(ele).addClass("deleteSelect");
                }
                select(ele);
                scope.uploader.queue.pop(item);
            }

            uploader.onAfterAddingFile = function (fileItem) {
                var errorMessage = '';
                if (fileItem.file.size <= 0) {
                    errorMessage = "文件错误，不能上传！";
                }
                if (fileItem.file.size >= 50000000) {
                    errorMessage = "文件大小超过50M限制！";
                }
                if (errorMessage) {
                    scope.docsUploadList.pop(fileItem);
                    fileItem.remove();
                    layer.alert(errorMessage, {
                        title: '提示',
                        closeBtn: 0,
                        move: false
                    });

                }
            }

            function save() {


                // uploader.onErrorItem = function (item, response, status, headers) {
                //     layer.closeAll();
                //     $timeout(function () {
                //         if (!uploadErrorSignal) {
                //             layer.alert("网络错误，上传失败，请重新上传！", {
                //                 title: '提示',
                //                 closeBtn: 0,
                //                 move: false
                //             });
                //
                //             uploader.cancelAll();
                //             uploader.clearQueue();
                //             uploadErrorSignal = true;
                //         }
                //     }, 1000)
                // }
                //
                // //上传分2种情况，资料(2)
                // if (uploader.queue.length) {
                //     uploader.uploadAll();
                //     //每个上传成功之后的回调函数
                //     uploader.onSuccessItem = function (fileItem, response, status, headers) {
                //         //console.info('onSuccessItem', fileItem, response, status, headers);
                //         updateUploadList(response, 'uploader');
                //     };
                //     //全部成功的回调函数
                //     uploader.onCompleteAll = function () {
                //         onCompleteAllSignal = true;
                //     };
                //
                //
                // }
                //
                // if (!uploader.queue.length) {
                //     saveCooperation();
                // }
                //
                // //轮询是否上传成功
                // var checkUploadInterval = setInterval(function () {
                //     if (onCompleteAllSignal == true && uploadErrorSignal == false) {
                //
                //         clearUploadInterval();
                //         layer.alert('onCompleteAllSignal', onCompleteAllSignal);
                //         saveCooperation();
                //     } else if (uploadErrorSignal == true) {
                //         clearUploadInterval();
                //         uploadErrorSignal = false;
                //     }
                // }, 100);
                // //清除轮询
                // function clearUploadInterval() {
                //     clearInterval(checkUploadInterval);
                // }
                //
                //
                // function saveCooperation() {
                //     //拼接资料数组
                //     var docSelectedList1 = [];
                //     angular.forEach(scope.docsUploadList, function (value, key) {
                //         var a = {};
                //         // if(backJson){
                //         //     var modifys = [];
                //         //     angular.forEach(backJson,function(value1, key1){
                //         //         if(!value1){
                //         //             return;
                //         //         }
                //         //         if(key1 == value.uuid){
                //         //             var i = 0;
                //         //             for(i = 0; i < value1.PdfModify.length; i++)
                //         //             {
                //         //                 modifys.push(value1.PdfModify[i]);
                //         //             }
                //         //         }
                //         //     });
                //         // }
                //         // a.modifys = modifys;
                //         a.md5 = value.filemd5;
                //         a.name = value.docName;
                //         a.needSign = false;
                //         a.uuid = value.uuid;
                //         a.size = value.filesize;
                //         // a.sourceType = scope.beSourceType;
                //         docSelectedList1.push(a);
                //     });
                //
                // }
                //
                // console.log(docSelectedList1);
            }
        }
    }
})

// 新建和施工弹框关联构建组
// 关联构建组
angular.module('core').directive('editCompGroup', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            console.log($('.btn-associate'));
            $('.btn-associate').on('click',function () {
                $('.modal-comp-group').css('display','block').siblings('.model-content').css('opacity',0.1);
            });
            $('#closeModalCompGroup').on('click',function () {
                $('.modal-comp-group').css('display','none').siblings('.model-content').css('opacity',1);
            });
//             scope.editCompGroup = function () {
//                 if(scope.ppid != null) {
//                     // 请求构件组数据
//                     commonService.findCompGroupsByPpid(scope.ppid).then(function(data){
//                         // 弹框
//                         var modalInstance = $uibModal.open({
//                             //animation: true,    // 弹框的动画效果 默认是true
//                             size: 'lg',
//                             templateUrl: 'template/category_second/edit_comp_group.html',
//                             controller: 'editCompGroupCtrl',
//                             resolve: {
//                                 compGroupInfos: function () {
//                                     return data.data;
//                                 }
//                             }
//                         });
//                         modalInstance.result.then(function (compGroupInfo) {
//                             commonService.updateCompGroupId(scope.stakeInfo.childItemId, compGroupInfo.compGroupId).then(function(){
//                                 console.log('关联构件组成功');
//                                 $('#compGroupName').val(compGroupInfo.name);
//                             });
//                         }, function () {
//                             //console.info('Modal dismissed at: ' + new Date());
//                             console.log("取消关联构件组");
//                         });
//                     });
//                 }
//             };
        }}})
