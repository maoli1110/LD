'use strict';
/**
 * 第二类树结构
 * Created by kylee on 2017/5/1.
 */
angular.module('core').controller('secondCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile','$state',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile,$state) {
        /**
         * $scope.ztreeOpenId为当前展开的树的treeId
         */
        //contractlist是否完成repeat标志
        $scope.flag={
            contractListRepeat:false 
        };
        //tree 设置
        var $body= $("body");
        var zNodes,
            zTree, //ztree对象
            selectedNodes; //当前选中的节点
        var rMenu = $("#rMenu");
        var currentContractId;//当前选中的合同段
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
        };
        //点击树节点对应的+-
        function beforeExpand(treeId, treeNode) {
            zTree.removeChildNodes(treeNode);
            selectedNodes = treeNode;
            if (!treeNode.isAjaxing) {
                var getNodeInfo = {
                    id: treeNode.id,
                    nodeType: treeNode.nodeType
                }
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
            $scope.$broadcast('call', $scope.name);//传值
            $state.go('second.projectDivisionStake');
        }

        //获取项目部
        commonService.getDept().then(function(data){
            $scope.deptList = data;
        })

        //获取项目部下合同段
        $scope.getContractList = function(deptId){
            commonService.getContractList(deptId).then(function(data){
                $scope.contractList = data.data;
            });
        }

        //点击项目部下合同段
        $scope.getContractInfo = function(id){
            currentContractId = id;
            $state.go('second.projectDivisionContract');
        }

        //获取树节点
        $scope.getzTreeNode = function(deptId,id){
            var param = {
                id:1,
                nodeType:-1
            }
            commonService.getTreeNode(param).then(function(data){
                zTree = $.fn.zTree.init($("#ztree_"+deptId+"_"+id), setting, data.data);
            });
        }
        //右键功能
        function OnRightClick(event, treeId, treeNode) {
            var mX = event.clientX-30,
                mY = event.clientY+10;
            if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
                zTree.cancelSelectedNode();
                showRMenu("root", mX, mY);
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
        function removeTreeNode(e) {
            hideRMenu();
            var zTree = $.fn.zTree.getZTreeObj($scope.ztreeOpenId),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            var delUrl = config.delDeptUrl;
            if (nodes && nodes.length>0) {
                var msg;
                if (nodes[0].child && nodes[0].child.length > 0) {//父部门的情况
                    msg = "此部门有下级部门，确认删除此部门?";          
                } else{//子部门的情况
                    msg = "确认删除此部门?";
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
        }

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
            // TODO 移动后的顺序保存到服务器

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
            // TODO 移动后的顺序保存到服务器

        }

        $(document).ready(function(){
            //添加-显示二级菜单
            $("#m_add").mouseover(function(){
                debugger
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
            })
            //鼠标滑开rMenu区域的操作
            $("#rMenu").mouseleave(function(){
                $("#rMenu .sub-operation").css('display','none');
                $("#rMenu .sub-operation>li").css('display','none');
                $("#rMenu .move-operation").css('visibility','hidden');
            })

            //重命名
            $("#m_rename").on("click",function(){
                $("#rMenu .sub-operation").show()
                // renameTreeNode();
            });

            //删除
            $("#m_del").on("click",function(){
                $("#rMenu .sub-operation").show()
                // removeTreeNode();
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

        //新建单位/子单位/分部/子分部/分项/子分项工程弹框
        $scope.createNodeModal = function (iurl,ctrl,createNodeType,size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size:size,
                templateUrl:iurl,
                controller: ctrl,
                resolve: {
                    items: function () {
                        var item = {}
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
                }
                //创建树节点
                commonService.createTreeNode(createDataInfo).then(function(data){
                    //获取子节点(获取当前节点下所有的数据)
                    /**
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

        //contractlist repeat finish end
        $scope.$on('contractlistNgRepeatFinished',function(){
            if(!$scope.flag.contractListRepeat){
                $scope.flag.contractListRepeat=true;
            }
        });

    }]);