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
                    if (!scope.flag.deptRepeatFinish) {
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
            $(".menu-nav").each(function () {
                if ($(this).css('display') !== 'none') {
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
function getZtreeChildNode(ztreeNode, nodes) {
    if (!ztreeNode.isParent) {
        return;
    }
    var children = ztreeNode.children;
    if (children != null && children.length > 0) {
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (nodes.indexOf(child) < 0) {
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
                $('.menu-nav').each(function () {
                    if ($(this).css('display') !== 'none') {
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
            scope.deleteAttachmentModal = function (windowStatus) {
                var modalInstance = $uibModal.open({
                    animation: scope.animationsEnabled,
                    templateUrl: 'template/category_first/modal_delete_attachment.html',
                    controller: 'deleteAttachmentModal',
                    resolve: {
                        items: function () {
                            return {
                                windowStatus: windowStatus,
                                id: null
                            };
                        }
                    }
                });
                modalInstance.result.then(function () {
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

// 上传附件upload
angular.module('core').directive('uploadFiles', function (FileUploader, $timeout) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            var basePath = "http://192.168.13.215:8080/LBLD/",
                popStateNum = 0;

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

            // console.log(scope.constructConstractInfos);
            var fileLength;
            if (scope.constructConstractInfos) {
                fileLength = scope.constructConstractInfos.contractFiles.length;
            }

            //FILTERS
            uploader.filters.push({
                name: 'customFilter',
                fn: function (item /*{File|FileLikeObject}*/, options) {

                    if ((scope.docsUploadList.length + fileLength) > 5) {
                        if (!scope.marker.docsRepeatMind) {
                            layer.alert('上传资料不能多于5个！', {
                                closeBtn: 0,
                                move: false
                            });
                        }
                        scope.marker.docsRepeatMind = true;
                        return scope.uploader.queue.length < 5;
                    } else {
                        scope.docsUploadList.push(item.name);
                    }
                    return scope.uploader.queue.length < 5;
                }
            });
            /*
             * 删除数组中的某个元素
             * （删除附件时使用）
             * */
            Array.prototype.indexOf = function (val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == val) {
                        return i;
                    }
                }
                return -1;
            }
            Array.prototype.remove = function (val) {
                var index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            }
            //点击上传资料按钮
            scope.docsUpload = function () {
                scope.marker.docsRepeatMind = false;
                $('.upload-docs').attr('uploader', 'uploader');
                $('.upload-docs').attr('nv-file-select', '');
                $('.upload-docs').click();
            }

            scope.deleteCurrentAttachment = function (ele) {
                function select(ele) {
                    $(".deleteSelect").removeClass("deleteSelect");
                    $(ele).addClass("deleteSelect");
                }

                select(ele);
            }
            scope.deleteAttachmentLayer = function (windowStatus, item, uploadedStatus) {

                layer.open({
                    type: 1,
                    title: '删除附件',
                    area: ['400px', '200px'],
                    shadeClose: true, //点击遮罩关闭
                    content: '\<\div class="window-content"><div class="delete-constract-wrapper"><h3>确认要删除该附件吗？</h3></div>\<\/div>',
                    btn: ['确定', '取消'],
                    yes: function () {
                        console.log(1111);
                        // windowStatus 当前窗口状态
                        if (windowStatus == 1) {
                            //新建合同删除附件
                            var $select = $(".deleteSelect");
                            $select.parent().parent().remove();
                            scope.uploader.queue.remove(item);
                            scope.docsUploadList.remove(item.file.name);
                            console.log(scope.docsUploadList);
                            var arr = [1, 2, 34, 5];
                            console.log(arr.remove(2));
                        } else if (windowStatus == 2) {
                            //预览附件删除附件
                            console.log(1111);
                        } else if (windowStatus == 3) {
                            var $select = $(".deleteSelect");
                            $select.parent().parent().remove();
                            if (uploadedStatus == 'hasUploaded') {
                                scope.docsUploadList.length--;
                                console.log(scope.docsUploadList.length);
                                if (!scope.constructConstractInfos) {
                                    return;
                                }
                                scope.constructConstractInfos.contractFiles.remove(item);
                            } else {

                                scope.docsUploadList.remove(item.file.name);
                            }
                            scope.uploader.queue.remove(item);
                        }
                        layer.closeAll();
                    },
                    success: function () {
                        $('#confirmDelete').on('click', function () {
                            console.log(1111);
                        });
                    }
                })
            }


            // <div class="window-content">

            // </di
            // scope.deleteAccessory=function () {

            //     console.log(_this);
            //     console.log(scope.uploader.queue);
            //     console.log(scope.docsUploadList);
            //添加附件后的错误提示
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
        }
    }
})
//关联工程的下拉框下拉触发
angular.module('core').directive('showSelect', function ($timeout) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            $timeout(function () {
                $('.selectpicker').selectpicker({
                    style: '',
                    size: 'auto'
                });
            }, 0);
        }
    };
});

// 新建和施工弹框关联工程
angular.module('core').directive('editCompGroup', function (commonService) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            $('.btn-associate').on('click', function () {
                $('.modal-comp-group').css('display', 'block').siblings('.model-content').css('opacity', 0.1);
            });
            $('#closeModalCompGroup,#closeProject').on('click', function () {
                $('.modal-comp-group').css('display', 'none').siblings('.model-content').css('opacity', 1);
            });

            var level = 1;	// 当前树状态树展开、折叠深度
            var maxLevel = -1;
            var levelCategory = 1;	// 构建类别树状态树展开、折叠深度
            scope.openSignal = true;
            scope.projtype = "0";
            scope.functionOption = "0";
            var nodelist = [];//树dataArray
            var tjnodestore = [];
            var gjnodestore = [];
            var aznodestore = [];
            var revitnodestore = [];
            var teklanodestore = [];
            var pdfppidstore = [];
            var projTypeSearchPpid = [];//工程类型搜索出来的ppid
            var TextSearchPpid = [];//文本搜索出来的ppid
            var functionSearchPpid = [];//功能搜索出来的ppid
            var initPpid = [];//初始化没有任何条件的ppid
            var searchPpid = [];//最终合并ppid
            var maxlevel = 0;//最大层级
            var dataList = {};
            var ppid, projType, treeObj, floor, compClass, subClass, spec, productId;
            var setting = {
                view: {
                    selectedMulti: false
                },
                callback: {
                    onClick: zTreeOnClick,
                    onCollapse: function (event, treeId, treeNode) {
                        level = treeNode.level;
                        levelCategory = treeNode.level;
                    },
                    onExpand: function (event, treeId, treeNode) {
                        level = treeNode.level;
                        levelCategory = treeNode.level;
                    }
                }
            };
            scope.projectTree = [];
            scope.openSignal = true;
            scope.flagok = true;//弹出框禁用标识
            //获取工程树
            commonService.getProjectTree().then(function (data) {
                var data = data.data;
                findAllChilds(data);
                scope.projectTree = data;
                treeObj = $.fn.zTree.init($("#tree"), setting, scope.projectTree);
                //全部打开
                treeObj.expandAll(true);
                nodelist = treeObj.transformToArray(treeObj.getNodes());
                // 只打开一层
//			treeObj.expandNode(nodelist[0], true, false, null, true);
                // 设置当前打开的层数
                for (var i = 0; i < nodelist.length; i++) {
                    if (nodelist[i].level >= maxLevel) {
                        maxLevel = nodelist[i].level;
                    }
                    if (nodelist[i].type == 3) {
                        categoryprojtype(nodelist[i]);
                    }
                }
                level = maxLevel;
                levelCategory = maxLevel;
            });

            function findAllChilds(data) {
                //递归遍历子节点
                for (var x = 0; x < data.length; x++) {
                    if (data[x].type == 1) {	// 组织
                        data[x].iconSkin = "org";
                    } else if (data[x].type == 2) {	// 项目部
                        data[x].iconSkin = "dept";
                    } else if (data[x].type == 3 && data[x].value.indexOf("1-3-") == 0) {					// 土建预算
                        data[x].iconSkin = "tj";		// imgs/icon/1.png
                    } else if (data[x].type == 3 && data[x].value.indexOf("2-3-") == 0) {					// 钢筋预算
                        data[x].iconSkin = "gj";		//imgs/icon/2.png
                    } else if (data[x].type == 3 && data[x].value.indexOf("3-3-") == 0) {					// 安装预算
                        data[x].iconSkin = "az";//"imgs/icon/3.png";
                    } else if (data[x].type == 3 && data[x].value.indexOf("4-3-") == 0) {					// Revit
                        data[x].iconSkin = "revit";//"imgs/icon/4.png";
                    } else if (data[x].type == 3 && data[x].value.indexOf("5-3-") == 0) {					// Tekla
                        data[x].iconSkin = "tekla"; //"imgs/icon/5.png";
                    }	// TODO PDF图标 目前还没遇到pdf工程 不清楚value的规律
                    if (data[x].children != null && data[x].children.length > 0) {
                        findAllChilds(data[x].children);
                    }
                }
            }


            //工程分类处理
            function categoryprojtype(node) {
                if (maxlevel < node.level) {//获取最大层级
                    maxlevel = node.level;
                }

                var str0 = node.value.split("-")[0];
                var str1 = node.value.split("-")[1];
                var str2 = node.value.split("-")[3];
                initPpid.push(str2);
                projTypeSearchPpid.push(str2);
                TextSearchPpid.push(str2);
                functionSearchPpid.push(str2);
                if (str1 == '2') {
                    pdfppidstore.push(str2);
                } else if (str0 == "1") {
                    tjnodestore.push(str2);
                } else if (str0 == "2") {
                    gjnodestore.push(str2);
                } else if (str0 == "3") {
                    aznodestore.push(str2);
                } else if (str0 == "4") {
                    revitnodestore.push(str2);
                } else if (str0 == "5") {
                    teklanodestore.push(str2);
                }
            }


            function zTreeOnClick(event, treeId, treeNode) {
                //点击工程
                dataList.linkProjectSelected = treeNode;
                dataList.assembleLps = treeNode;
                ppid = dataList.assembleLps.value.split('-')[3];
                projType = dataList.assembleLps.value.split('-')[0];
                productId = dataList.assembleLps.value.split('-')[2];
                if (treeNode.isParent == true) {
                    // $('.confirm').attr('disabled', true);
                    scope.flagok = true;
                    scope.$apply();
                } else {
                    // $('.confirm').attr('disabled', false);
                    scope.flagok = false;
                    scope.$apply();
                }
                treeObj = $.fn.zTree.getZTreeObj("tree");
                var sNodes = treeObj.getSelectedNodes();
                if (sNodes.length > 0) {
                    var node = sNodes[0].getParentNode();
                }
                dataList.parentNode = node;
            }

            //选择构件类别确定按钮标志
            function onCheckZtree() {
                var selectedNodes = [];
                //当前选中的所有的节点
                var treeObj = $.fn.zTree.getZTreeObj("tree1");
                selectedNodes = treeObj.getCheckedNodes(true);
                if (selectedNodes.length) {
                    scope.flagok = false;
                    scope.$apply();
                } else {
                    scope.flagok = true;
                    scope.$apply();
                }
            }

            scope.ensure = function () {
                switch (projType) {
                    case "1":
                        projType = '土建预算';
                        break;
                    case "2":
                        projType = '钢筋预算';
                        break;
                    case "3":
                        projType = '安装预算';
                        break;
                    case "4":
                        projType = 'Revit';
                        break;
                    case "5":
                        projType = 'Tekla';
                        break;
                }
                dataList.assembleLps = {ppid: ppid, projType: projType};
                dataList.productId = productId;
                if (dataList) {
                    $('.modal-comp-group').css('display', 'none').siblings('.model-content').css('opacity', 1);
                    // $("#selectProjectName").val(dataList.linkProjectSelected.name);
                    // $("#selectProjectName").attr('title',dataList.linkProjectSelected.name);
                    $("#ppid").val(dataList.assembleLps.ppid);
                    $("#ppid").attr('type', 'hidden');
                    $("#ppid").attr('type', 'text');
                } else {
                    layer.alert('请关联相关工程！', {
                        closeBtn: 0,
                        move: false
                    });
                }
            }

            function projTypeSwitch(n) {
                switch (n) {
                    case 0:
                        return null;
                    case 1:
                        return tjnodestore;
                        break;
                    case 2:
                        return gjnodestore;
                        break;
                    case 3:
                        return aznodestore;
                        break;
                    case 4:
                        return revitnodestore;
                        break;
                    case 5:
                        return teklanodestore;
                        break;
                    case 6:
                        return pdfppidstore;
                        break;
                }
            }

            //可以查询
            var searchFlag;
            var pollingFlag = true;
            var checkSearchInterval;

            scope.delayTreeSearch = function (type) {
                setSearchFlagFalse();
                if (pollingFlag) {
                    pollingFlag = false;
                    checkSearchInterval = setInterval(function () {
                        checkCanSearch(type)
                    }, 250);
                }
                setTimeout(function () {
                    setSearchFlagTrue()
                }, 500);
                //全部打开
                level = commonService.expandAll("tree");

            };

            var setSearchFlagFalse = function () {
                searchFlag = false;
            }
            var setSearchFlagTrue = function () {
                searchFlag = true;
            }

            var checkCanSearch = function (type) {
                if (searchFlag) {
                    clearInterval(checkSearchInterval);
                    scope.treeSearch(type);
                    pollingFlag = true;
                }
            }

            scope.treeSearch = function (type, status) {
//	 		console.log(new Date());
                treeObj.showNodes(nodelist);
                //根据专业查询对应子节点
                if (type == 1) {
                    if (scope.projtype == 0) {
                        projTypeSearchPpid = initPpid;
                    } else {
                        projTypeSearchPpid = projTypeSwitch(parseInt(scope.projtype));
                    }
                }
                //根据功能进行同步请求查询对应子节点
                if (type == 2) {
                    if (scope.functionOption == 0) {
                        functionSearchPpid = initPpid;
                    } else {
                        var projTypeTextPpid = _.intersection(projTypeSearchPpid, TextSearchPpid);
                        functionSearchPpid = [];
                        functionFilter(projTypeTextPpid);
                    }

                }
                //根据条件查询对应子节点
                if (type == 3) {
                    if (scope.formText == "" || scope.formText == null || scope.formText == "underfined") {
                        TextSearchPpid = initPpid;
                    } else {
                        TextSearchPpid = searchByText();
                    }
                }
                searchPpid = _.intersection(projTypeSearchPpid, functionSearchPpid, TextSearchPpid);
                var showchildnodes = treeObj.getNodesByFilter(filterbyppid);
                var hidenodes = treeObj.getNodesByFilter(filterhidechild);
                treeObj.hideNodes(hidenodes);
                treeObj.showNodes(showchildnodes);
                hideparentnode();
                //全部打开
            }

            function filterchild(node) {
                var searchname = scope.formText;
                return (node.type == 3 && node.name.indexOf(searchname) > -1);
            }

            function searchByText() {
                var shownodes = treeObj.getNodesByFilter(filterchild);
                var TextSearchPpid = [];
                for (var i = 0; i < shownodes.length; i++) {
                    var str2 = shownodes[i].value.split("-")[3];
                    TextSearchPpid.push(str2);
                }
                return TextSearchPpid;
            }

            function filterhidechild(node) {
                return (node.type == 3);
            }

            function filterbyppid(node) {
                return (node.type == 3 && searchPpid.indexOf(node.value.split("-")[3]) > -1);
            }

            //全部功能筛选树结构
            // var functionFilter = function (projTypeTextPpid) {
            //     var ppids = [];
            //     var data = {};
            //     var infoType = parseInt('1200' + scope.functionOption);
            //     data.infoType = infoType;
            //     data.ppids = projTypeTextPpid;
            //     data = JSON.stringify(data);
            //     $.ajax({
            //         contentType: "application/json; charset=utf-8",
            //         dataType: 'json',
            //         type: "post",
            //         data: data,
            //         url: basePath + 'rs/co/getProjTipInfo',
            //         async: false,
            //         success: function (data) {
            //             for (var i = 0; i < data.length; i++) {
            //                 var ppid = data[i] + "";
            //                 functionSearchPpid.push(ppid);
            //             }
            //         },
            //         error: function () {
            //         }
            //     });
            // }
            //隐藏空父节点
            var selectlevel;

            function hideparentnode() {
                for (var i = maxlevel - 1; i > 0; i--) {
                    selectlevel = i;
                    var parentnodes = treeObj.getNodesByFilter(filterbylevel);
                    var needhidenods = [];
                    for (var j = 0; j < parentnodes.length; j++) {
                        var childnodes = parentnodes[j].children;
                        var ishide = true;
                        if (childnodes != null) {
                            for (var n = 0; n < childnodes.length; n++) {
                                if (childnodes[n].isHidden) {
                                    continue;
                                } else {
                                    ishide = false;
                                }
                            }
                        } else {
                            ishide = true;
                        }
                        if (ishide) {
                            needhidenods.push(parentnodes[j]);
                        }
                    }
                    treeObj.hideNodes(needhidenods);
                }
            }

            function filterbylevel(node) {
                return (node.level == selectlevel && node.type != 3);
            }


            // 展开树节点
            scope.expand = function (status) {
                var obj = {type: "expand", operObj: "tree", level: level};
                level = commonService.openOrClose(obj);
                $('#content-a11')[0].scrollTop = 0;

            }

            // 收起树节点
            scope.collapse = function (status) {
                var obj = {type: "collapse", operObj: "tree", level: level};
                level = commonService.openOrClose(obj);
                $('#content-a11')[0].scrollTop = 0;

            }

        }
    }
})
