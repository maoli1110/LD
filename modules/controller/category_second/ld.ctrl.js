'use strict';
/**
 * 第二类树结构
 * Created by kylee on 2017/5/1.
 */
angular.module('core').controller('ldCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile','$state',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile,$state) {
        /**
         * $scope.ztreeOpenId为当前展开的树的treeId
         * $scope.openPpid 为当前打开的合同段对应的ppid
         * $scope.flag.deptRepeatFinish 防止项目部循环结束结果被重复通知(由于LD中左侧树节点项目部数据相同,且用的是ng-show引入)
         */
        $scope.firstLeftTree = {
            deptId:null,
            contractId:null
        }
        $scope.secondLeftTree = {
            deptId:null,
            contractId:null
        }

        //根据子级的路由变化改变父级左侧树
        $scope.$on('changeRouter',function(event,currentRouterNum){
            $scope.currentRouterNum = currentRouterNum;
        });

        //首次进入页面或者F5刷新，项目部repeat完成之后的动作
        $scope.$on('deptNgRepeatFinished',function(event,currentRouterNum){
            // 如果是刷新工程划分-合同段页面 设置当前选择的合同段id为第一个项目部下的第一个合同段
            if($scope.currentRouterNum == 2 && $state.$current.name == 'ld.projectDivisionContract' && $scope.secondLeftTree.contractId == null) {
                // var deptId = $($('#secondLeftTree').children()[0]).attr('deptId');
                var deptId = $scope.firstLeftTree.deptId;
                $scope.getContractList(deptId, $scope.currentRouterNum, true);
            }
            if($scope.currentRouterNum == 1 && $state.$current.name == 'ld.first' && $scope.firstLeftTree.contractId == null) {
                // var deptId = $($('#secondLeftTree').children()[0]).attr('deptId');
                 var deptId = $scope.secondLeftTree.deptId;
                $scope.getContractList(deptId, $scope.currentRouterNum, true);
            }
        });

        $scope.flag={};

        //tree 设置
        var $body= $("body");
        var zNodes,
            zTree, //ztree对象
            selectedNodes; //当前选中的节点
        var rMenu = $("#rMenu");
        var currentContractId;//当前选中的合同段

        //获取项目部
        commonService.getDept().then(function(data){
            $scope.deptList = data;
            //首次加载默认的deptId 
            var defaultDeptId = data[0].deptId;
            $scope.firstLeftTree.deptId = defaultDeptId;
            $scope.secondLeftTree.deptId = defaultDeptId;
        });

        //获取项目部下合同段
        $scope.getContractList = function(deptId, leftTreeType, refresh){
            switch(leftTreeType){
                case 1 :
                $scope.firstLeftTree.deptId = deptId;
                break;
                case 2 :
                $scope.secondLeftTree.deptId = deptId;
            }
            commonService.getContractList(deptId).then(function(data){
                $scope.flag.deptRepeatFinish = false;
                var contractList = data.data;
                contractListHtml(contractList,deptId,leftTreeType);//生成合同段列表
                // 如果是刷新第二种树 默认展开第一个项目部
                if(refresh && $scope.currentRouterNum == 2){
                    $($('#secondLeftTree li ul')[0]).css('display','block');
                    var contractId = $($('#secondLeftTree li ul a')[0]).attr('id').substring('contract_'.length).trim();
                    // 如果刷新页是工程划分-合同段页面 设置右侧内容页的选中合同段id
                    if($state.$current.name == 'ld.projectDivisionContract') {
                        $scope.getContractInfo2(contractId);
                    }
                }
            });
        };

        //生成合同段列表
        function contractListHtml(contractList,deptId,leftTreeType) {
           
            $("#ul"+leftTreeType+"-"+deptId).empty();

            if(leftTreeType == 1){
                angular.forEach(contractList,function(value,key){
                    var li = '<li class="contract-name active">';
                    li += '      <a ng-click="getContractInfo1('+value.id+')" id="contract_'+value.id+' " ppid="'+value.ppid+'"';
                    if(key == 0) {  // 默认第一个合同段是选中状态
                        li += 'class="active" ';
                    }
                    li += '>'+value.sectionNum;
                    li += ' </li>';
                    var template = $compile(li)($scope);
                    angular.element(document.getElementById("ul1-"+deptId)).append(template);
                });
            }

            if(leftTreeType == 2){
                angular.forEach(contractList,function(value,key){
                    var li = '<li class="contract-name active">';
                    li += '      <a ng-click="getContractInfo2('+value.id+')" id="contract_'+value.id+' " ppid="'+value.ppid+'"';
                    if(key == 0) {  // 默认第一个合同段是选中状态
                        li += 'class="active" ';
                    }
                    li += '>'+value.sectionNum;
                    li += '      <i class="icon state-down" ng-click="getzTreeNode('+value.id+','+deptId+')" id="'+value.id+'"></i>';
                    li += '      </a>';
                    li += '      <ul id="ztree-'+deptId+'-'+value.id+'" class="ztree" style="display: none;"><li>1</li></ul>';
                    li += ' </li>';
                    var template = $compile(li)($scope);
                    angular.element(document.getElementById("ul2-"+deptId)).append(template);
                });
                $('.icon').click(function (ele) {
                    var tree = $(ele.target).parent().siblings('ul');
                    if (tree.css('display') === 'none') {
                        tree.slideDown(300);
                        $(ele.target).removeClass('state-down').addClass('state-up');
                        ztreeOpen = true;
                        $scope.ztreeOpenId = tree.attr("id");
                        $scope.openPpid = $(ele.target).parent().attr('ppid');
                    } else {
                        tree.slideUp(300);
                        $(ele.target).removeClass('state-up').addClass('state-down');
                        ztreeOpen = false;
                    }
                    $(ele.target).parent().parent().siblings().find('>ul').slideUp(300);
                    $(ele.target).parent().parent().siblings().find('.icon').removeClass('state-up').addClass('state-down');
                });
            }
            
            $('.contract-name > a').on('click', function () {
                $(this).addClass('active').parent().siblings().find('>a').removeClass('active');
            });
            
        }

        //点击项目部下合同段
        $scope.getContractInfo1 = function(id){
            currentContractId = id;
            $scope.firstLeftTree.contractId = id;
            $scope.$broadcast('to-projectDivisionContract', $scope.secondLeftTree.contractId);//传当前合同段的id
            $state.go('ld.first');
        };

        //点击项目部下合同段
        $scope.getContractInfo2 = function(id){
            currentContractId = id;
            $scope.secondLeftTree.contractId = id;
            $scope.$broadcast('to-projectDivisionContract', $scope.secondLeftTree.contractId);//传当前合同段的id
            $state.go('ld.projectDivisionContract');
        };


        //获取树节点
        $scope.getzTreeNode = function(id,deptId){
            var testParam = {
                id:1,
                nodeType:-1,
                deptId:deptId
            };
            commonService.getTreeNode(testParam).then(function(data){
                zTree = $.fn.zTree.init($("#ztree-"+deptId+"-"+id), setting, data.data);
            });
        };

        //新建单位/子单位/分部/子分部/分项/子分项工程弹框
        $scope.createNodeModal = function (iurl,ctrl,createNodeType,size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size:size,
                templateUrl:iurl,
                controller: ctrl,
                resolve: {
                    items: function () {
                        var item = {};
                        item.id = selectedNodes.id; //当前选中节点的id
                        item.parentId = selectedNodes.parentId; //当前选中节点的父ID
                        item.nodeType = selectedNodes.nodeType; //当前选中节点的nodeType
                        item.createNodeType = createNodeType;
                        item.currentContractId = currentContractId;
                        return item;
                    }
                }
            });
            modalInstance.result.then(function (createDataInfo) {
                //获取子节点参数拼接
                var getNodeInfo = {
                    id: createDataInfo.parentId,
                    nodeType: selectedNodes.nodeType
                };
                //创建树节点
                commonService.createTreeNode(createDataInfo).then(function(data){
                    /**
                     * 获取子节点(获取当前节点下所有的数据)
                     * 若当前只有单位工程，id:当前合同段 nodetype:-1
                     * 若当前节点不止单位工程，id:当前选中节点的id nodetype不传
                     */
                    commonService.getTreeNode(getNodeInfo).then(function(data){
                        addTreeNode(data.data);
                    });

                })
                
            }, function () {
            });
        };

        var setting = {
            view: {
                showIcon: showIconForTree
            },
            async: {
                enable:false
            },
            data: {
                simpleData: {
                    enable: false,
                    idKey: "id",
                    pIdKey: "parentId"
                },
                key: {
                    name: "nodeName"
                }
            },
            callback: {
                beforeExpand: beforeExpand,
                onClick:ztreeOnclick,
                onRightClick: OnRightClick
            }
        };
        
        function showIconForTree(treeId, treeNode) {
            return !treeNode.isParent;
        }
        //点击树节点对应的+-
        function beforeExpand(treeId, treeNode) {
            zTree.removeChildNodes(treeNode);
            selectedNodes = treeNode;
            if (!treeNode.isAjaxing) {
                var getNodeInfo = {
                    id: treeNode.id,
                    nodeType: treeNode.nodeType
                };
                commonService.getTreeNode(getNodeInfo).then(function(data){
                    addTreeNode(data.data);
                });
                return true;
            } else {
                alert("zTree 正在下载数据中，请稍后展开节点。。。");
                return false;
            }
        }
        //单击树节点的callback事件
        function ztreeOnclick () {
            //异步获取当前选中节点的子节点
            $scope.name="hello1";
            var zTree = $.fn.zTree.getZTreeObj($scope.ztreeOpenId),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            // 通过左侧树拿到工程划分-桩号页面需要展示的数据
            if(treeNode.nodeType == 5) {    // 当前节点是子分项工程，工程划分-桩号内容页才有数据
                var itemized = treeNode.getParentNode();    // 分项
                var childDeptProject = itemized.getParentNode();    // 子分部
                var deptProject = childDeptProject.getParentNode();    // 分部
                var childUnitProject = deptProject.getParentNode();    // 子单位
                var unitProject = childUnitProject.getParentNode();    // 单位

                $scope.stakeInfo = {
                    'contractName':$('#'+$scope.ztreeOpenId).prev().text(), // 合同段名字
                    'unitProjectName':unitProject.nodeName, 'unitProjectNameNum':unitProject.nodeNum, // 单位名称
                    'childUnitProjectName':childUnitProject.nodeName,    // 子单位
                    'deptProjectName':deptProject.nodeName,'deptProjectNameNum':deptProject.nodeNum, // 分部名称
                    'childDeptProjectName':childDeptProject.nodeName, // 子分部
                    'itemizedName':itemized.nodeName,'itemizedNameNum':treeNode.nodeNum,   // 分项
                    'childItemizedName':treeNode.nodeName,   // 子分项名称
                    'treeId':treeNode.id  // 左侧树的id
                };
                $scope.$broadcast('to-projectDivisionStake', $scope.stakeInfo, $scope.openPpid);//传值
                $state.go('ld.projectDivisionStake');
            }
        }


        //右键功能
        function OnRightClick(event, treeId, treeNode) {
            var mX = event.clientX-30,
                mY = event.clientY+10;
            if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
                zTree.cancelSelectedNode();
                // showRMenu("root", mX, mY);
            } else if (treeNode && !treeNode.noR) {
                zTree.selectNode(treeNode);
                selectedNodes = zTree.getSelectedNodes()[0];
                showRMenu("node", mX, mY);
            }
        }

        //显示右键菜单
        function showRMenu(type, x, y) {
            $("#rMenu ul").show();
            if (type=="root") {
                $("#m_del").hide();
            } else {
                $("#m_del").show();
            }
            rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});
            $("#rMenu .operation").css('visibility','visible');
            $("body").bind("mousedown", onBodyMouseDown);
        }
        //隐藏右键菜单
        function hideRMenu() {
            if (rMenu) rMenu.css({"visibility": "hidden"});
            $("#rMenu .operation").css('visibility','hidden');
            $("#rMenu .sub-operation").css('display','none');
            $("#rMenu .move-operation").css('visibility','hidden');
            $("body").unbind("mousedown", onBodyMouseDown);
        }
        //鼠标mousedown的操作
        function onBodyMouseDown(event){
            if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length>0)) {
                // rMenu.css({"visibility" : "hidden"});
                $("#rMenu,#rMenu .operation,#rMenu .sub-operation-move").css('visibility','hidden');
                $("#rMenu .sub-operation > li").css('display','none');
            }
        }
        //创建(获取)对应的树节点
        function addTreeNode(newNodes) {
            hideRMenu();
            var treeNode = selectedNodes;
            var isParent = false;
            if (treeNode) {
                treeNode = zTree.addNodes(treeNode, newNodes);
                // zTree.reAsyncChildNodes([{id:(100 + newCount), parentId:treeNode.id, isParent:isParent, name:"新增部门"}], "refresh");
            } else {
                treeNode = zTree.addNodes(null, newNodes);
            }
            if (!treeNode) {
                alert("此部门无法增加子部门");
            }
        }

        //删除节点
        /*function removeTreeNode(e) {
            hideRMenu();
            var zTree = $.fn.zTree.getZTreeObj($scope.ztreeOpenId),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            //var delUrl = config.delDeptUrl;
            if (nodes && nodes.length>0) {
                var msg;
                if (nodes[0].child && nodes[0].child.length > 0) {//父部门的情况
                    msg = "此部门有下级部门，确认删除此部门？";
                } else{//子部门的情况
                    msg = "确认删除此部门？";
                }
                $body.modalBox({
                    msg:msg,
                    okFun:function(){
                        ajaxServer(delUrl,JSON.stringify({"id":nodes[0].id}),function(data){
                            if (data.success) {
                                $.modalBox.close();
                                zTree.removeNode(treeNode, callbackFlag);
                                $body.msgBox({
                                     status : 'success',
                                     msg : "删除成功",
                                     time:1000
                                });
                            }
                        });
                    }
                });
            }
        }*/
        // 删除节点
        function removeTreeNode() {
            hideRMenu();
            var zTree = $.fn.zTree.getZTreeObj($scope.ztreeOpenId),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            //默认提示信息是子部门
            $scope.msg = "确认删除此部门？";
            if ((treeNode != null && treeNode.child && treeNode.child.length>0) || treeNode.isParent) {
                //父部门的情况
                $scope.msg = "此部门有下级部门，确认删除此部门？";
            }
            var modalInstance = $uibModal.open({
                //animation: true,    // 弹框的动画效果 默认是true
                size: 'sm',
                templateUrl: 'template/category_second/modal_del_proj.html',
                controller: 'delCompGroupCtrl',
                scope:$scope
            });
            modalInstance.result.then(function () {
                var treeNodeId = treeNode.id;
                var contractId = $('#'+$scope.ztreeOpenId).prev().attr('id').substring('contract_'.length).trim();
                commonService.deleteTreeNode(treeNodeId, contractId).then(function(){
                    console.log('删除树节点成功');
                });
            }, function () {
                //console.info('Modal dismissed at: ' + new Date());
                console.log('取消删除树节点');
            });
        };

        function beforeRename(treeId, treeNode, newName) {
            var addDeptUrl = config.addDeptUrl;
            var updateDeptUrl = config.updateDeptUrl;
            var param = JSON.stringify({
                    "id":treeNode.id,
                    "name":newName,
                    "parentId":treeNode.parentId,
                    "order":treeNode.order
                });
            //console.log(treeId+"," +treeNode.parentId+"," +newName);
            if(addStatus == true){
                ajaxServer(addDeptUrl,param,function(data){
                    if (data.success) {
                        $body.msgBox({
                             status : 'success',
                             msg : "新增成功",
                             time:1000
                        });
                        addStatus = false;
                    }
                });
            }else{
                ajaxServer(updateDeptUrl,param,function(data){
                    if (data.success) {
                        $body.msgBox({
                             status : 'success',
                             msg : "重命名成功",
                             time:1000
                        });
                    }
                });
            }
        }
        
        function renameTreeNode() {
            hideRMenu();
            var zTree = $.fn.zTree.getZTreeObj($scope.ztreeOpenId),
            nodes = zTree.getSelectedNodes(),
            treeNode = nodes[0];
            if (nodes.length == 0) {
                alert("请先选择一个部门");
                return;
            }
            zTree.editName(treeNode);
        }
        /**
         * 上移树节点
         */
        function moveUpTreeNode() {
            hideRMenu();
            var zTree = $.fn.zTree.getZTreeObj($scope.ztreeOpenId),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            var preNode = treeNode.getPreNode();
            if(preNode == null){
                return;
            }
            zTree.moveNode(preNode, treeNode, "prev");
            // 移动后的顺序保存到服务器
            var children = treeNode.getParentNode().children;
            var nodeIds = [];
            for(var i = 0; i < children.length; i++){
                nodeIds[i] = children[i].id;
            }
            commonService.sortNodes(nodeIds);
        }
        /**
         * 下移树节点
         */
        function moveDownTreeNode() {
            hideRMenu();
            var zTree = $.fn.zTree.getZTreeObj($scope.ztreeOpenId),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            var nextNode = treeNode.getNextNode();
            if(nextNode == null) {
                return;
            }
            zTree.moveNode(nextNode, treeNode, "next");
            // 移动后的顺序保存到服务器
            var children = treeNode.getParentNode().children;
            var nodeIds = [];
            for(var i = 0; i < children.length; i++){
                nodeIds[i] = children[i].id;
            }
            commonService.sortNodes(nodeIds);
        }

        $(document).ready(function(){
            //添加-显示二级菜单
            $("#m_add").mouseover(function(){
                // 获取当前选择的节点的nodetype
                $("#rMenu .sub-operation-move").css('visibility','hidden');
                $("#rMenu .sub-operation").css('display','block');
                $("#rMenu .sub-operation > li").css('display','none');
                // selectedNodes = zTree.getSelectedNodes();
                var currentNodeType = selectedNodes.nodeType;
                switch (currentNodeType){
                    case 0:
                    $("#m_unit").css('display','block');
                    $("#m_sub_unit").css('display','block');
                    $("#m_part").css('display','block');
                    break;
                    case 1:
                    $("#m_sub_unit").css('display','block');
                    $("#m_part").css('display','block');
                    break;
                    case 2:
                    debugger
                    $("#m_part").css('display','block');
                    $("#m_sub_part").css('display','block');
                    $("#m_item").css('display','block');
                    break;
                    case 3:
                    $("#m_sub_part").css('display','block');
                    $("#m_item").css('display','block');
                    break;
                    case 4:
                    $("#m_item").css('display','block');
                    $("#m_sub_item").css('display','block');
                    break;
                    case 5:
                    $("#m_sub_item").css('display','block');
                    break;
                    default:
                    $("#rMenu .sub-operation").css('display','block');
                    $("#rMenu .sub-operation > li").css('display','block');
                    break
                }
                
            });
            //移动-显示二级菜单
            $("#m_move").mouseover(function(){
                $("#rMenu .sub-operation").css('display','none');
                $("#rMenu .sub-operation>li").css('display','none');
                $("#rMenu .sub-operation-move").css('visibility','visible');
            });
            //鼠标滑开rMenu区域的操作
            $("#rMenu").mouseleave(function(){
                $("#rMenu .sub-operation").css('display','none');
                $("#rMenu .sub-operation>li").css('display','none');
                $("#rMenu .move-operation").css('visibility','hidden');
            });

            //重命名
            $("#m_rename").on("click",function(){
                $("#rMenu .sub-operation").show();
                // renameTreeNode();
            });

            //删除
            $("#m_del").on("click",function(){
                $("#rMenu .sub-operation").show();
                 removeTreeNode();
            });

            //上移节点
            $("#m_move_up").on("click",function(){
                moveUpTreeNode();
            });

            //下移节点
            $("#m_move_down").on("click",function(){
                moveDownTreeNode();
            });
        });

        //=====我是合同管理分割线
        

        //======我是变更管理分割线=======
        
        
    }]);