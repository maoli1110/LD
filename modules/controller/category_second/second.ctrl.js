'use strict';
/**
 * 第二类树结构
 * Created by kylee on 2017/5/1.
 */
angular.module('core').controller('secondCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile','$state',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile,$state) {
        //全局参数
        var config = {
            initDeptUrl:"contact/initDepartment.action",
            addDeptUrl:"contact/addDept.action",
            updateDeptUrl:"contact/updateDept.action",
            delDeptUrl:"contact/delDept.action"
        };
        //contractlist是否完成repeat标志
        $scope.flag={
            contractListRepeat:false 
        };
        $scope.ztreeOpenId;
        //tree 设置
        var $body= $("body");
        var zNodes,zTree;
        var rMenu = $("#rMenu");
        //ztree list
        var setting = {
            view: {
                showIcon: false
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pId",
                    rootPId:0
                },
                key: {
                    name: "name"
                }
            },
            callback: {
                onClick:ztreeOnclick,
                onRightClick: OnRightClick
            }
        };
        function ztreeOnclick () {
            $scope.name="hello1";
            $scope.$broadcast('call', $scope.name);//传值
            $state.go('second.projectDivisionStake');
        }
        //获取项目部
        commonService.getDept().then(function(data){
            // console.log('getDept')
            // console.log(data,'getDept');
            $scope.deptList = data;
        })
        //获取项目部下合同段
        $scope.getContractList = function(deptId){
            commonService.getContractList(deptId).then(function(data){
                $scope.contractList = data.data;
            });
        }
        //点击项目部下合同段
        $scope.getContractInfo = function(){
            $state.go('second.projectDivisionContract');
        }
        //获取左侧树
        $scope.getzTreeData = function(deptId,id){
            commonService.getzTreeData().then(function(data){
                zTree = $.fn.zTree.init($("#ztree_"+deptId+"_"+id), setting, data.data);
            });
        }

        // $scope.name="hello";
        // $scope.$broadcast('call', $scope.name);//传值

        // function  getTree(){
        //     var initUrl = config.initDeptUrl;
        //     ajaxServer(initUrl,{},function(data){
        //         zNodes = data.data;
        //         printTree(zNodes);
        //     },{type:"GET"});    
        // }   

        // function printTree(zNodes){
        //     $.fn.zTree.init($("#tree"), setting, zNodes);
        //     zTree = $.fn.zTree.getZTreeObj($scope.ztreeOpenId);
        // }

        function OnRightClick(event, treeId, treeNode) {
            var mX = event.clientX-30,
                mY = event.clientY+10;
            if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
                zTree.cancelSelectedNode();
                // showRMenu("root", mX, mY);
            } else if (treeNode && !treeNode.noR) {
                zTree.selectNode(treeNode);
                showRMenu("node", mX, mY);
            }
        }
        function showRMenu(type, x, y) {
            $("#rMenu ul").show();
            if (type=="root") {
                $("#m_del").hide();
            } else {
                $("#m_del").show();
            }
            rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});

            $("body").bind("mousedown", onBodyMouseDown);
        }
        function hideRMenu() {
            if (rMenu) rMenu.css({"visibility": "hidden"});
            $("#rMenu .sub-operation").css('visibility','hidden')
            $("#rMenu .move-operation").css('visibility','hidden')
            $("body").unbind("mousedown", onBodyMouseDown);
        }
        function onBodyMouseDown(event){
            if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length>0)) {
                rMenu.css({"visibility" : "hidden"});
            }
        }
        var newCount = 1;
        var addStatus = false;
        function addTreeNode(e) {
            hideRMenu();
            var zTree = $.fn.zTree.getZTreeObj($scope.ztreeOpenId),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            var isParent = false;
            if (treeNode) {
                treeNode = zTree.addNodes(treeNode, {id:(100 + newCount), parentId:treeNode.id, isParent:isParent, name:"新增部门"});
            } else {
                treeNode = zTree.addNodes(null, {id:(100 + newCount), parentId:0, isParent:isParent, name:"新增部门"});
            }
            if (treeNode) {
                addStatus = true;
                zTree.editName(treeNode[0]);
            } else {
                alert("此部门无法增加子部门");
            }
        }
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
                // debugger
                $("#rMenu .sub-operation").css('visibility','visible')
                $("#rMenu .move-operation").css('visibility','hidden')
            });
            //移动-显示二级菜单
            $("#m_move").mouseover(function(){
                $("#rMenu .sub-operation").css('visibility','hidden')
                $("#rMenu .move-operation").css('visibility','visible')
            })
            //鼠标滑开rMenu区域的操作
            $("#rMenu").mouseleave(function(){
                $("#rMenu .sub-operation").css('visibility','hidden')
                $("#rMenu .move-operation").css('visibility','hidden')
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
            //添加单位工程
            $("#m_unit").on("click",function(){
                addTreeNode();
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


        //新建单位工程弹框
        $scope.createSuperviseModal = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_first/modal_create_supervise_contract.html',
                controller: 'ModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
            });
        };

        // $scope.$on('ngRepeatFinished',function(){
        //     alert(22222);
        //     $timeout(function(){
        //         debugger
        //         $('.contract-name > a').on('click', function () {
        //             $(this).addClass('active').parent().siblings().find('>a').removeClass('active');
        //         });
        //     },1000)
            
        // })
        //contractlist repeat finish end
        $scope.$on('contractlistNgRepeatFinished',function(){
            if(!$scope.flag.contractListRepeat){
                $scope.flag.contractListRepeat=true;
            }
           
        });

    }]);