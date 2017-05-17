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
        $scope.thirdLeftTree = {
            deptId:null,
            contractId:null
        }
        $scope.fourLeftTree = {
            deptId:null,
            contractId:null
        }
        var currentContractType; //当前合同类型
        var DefaultNodeName = {
            unitNameArr:null,
            partNameArr:null,
            itemNameArr:null
        }
        //根据子级的路由变化改变父级左侧树
        $scope.$on('changeRouter',function(event,currentRouterNum){
            $scope.currentRouterNum = currentRouterNum;
        });

        //首次进入页面或者F5刷新，项目部repeat完成之后的动作
        $scope.$on('deptNgRepeatFinished',function(event,currentRouterNum){
            // 第二种树 刷新时都要默认展开第一个项目部下的第一个合同段 设置当前选择的合同段id为第一个项目部下的第一个合同段
            if($scope.currentRouterNum == 1 && $scope.firstLeftTree.contractId == null) {
                // var deptId = $($('#secondLeftTree').children()[0]).attr('deptId');
                var deptId = $scope.firstLeftTree.deptId;
                $scope.getContractList(deptId, $scope.currentRouterNum, true);
            }
            if($scope.currentRouterNum == 2 && $scope.secondLeftTree.contractId == null) {
                // var deptId = $($('#secondLeftTree').children()[0]).attr('deptId');
                var deptId = $scope.secondLeftTree.deptId;
                $scope.getContractList(deptId, $scope.currentRouterNum, true);
            }
            if($scope.currentRouterNum == 3 && $scope.thirdLeftTree.contractId == null) {
                // var deptId = $($('#secondLeftTree').children()[0]).attr('deptId');
                var deptId = $scope.secondLeftTree.deptId;
                $scope.getContractList(deptId, $scope.currentRouterNum, true);
            }
            if($scope.currentRouterNum == 4 && $scope.fourLeftTree.contractId == null) {
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
            currentContractType = 'constructContract';
            $scope.deptList = data;
            //首次加载默认的deptId
            var defaultDeptId = data[0].deptId;
            $scope.firstLeftTree.deptId = defaultDeptId;
            $scope.secondLeftTree.deptId = defaultDeptId;
        });

        //firstLeftTree页面获取项目部
        $scope.firstTreeGetDept = function (contractType) {
            currentContractType = contractType;
            commonService.getDept().then(function(data){
                $scope.deptList = data;
                //首次加载默认的deptId
                var defaultDeptId = data[0].deptId;
                $scope.firstLeftTree.deptId = defaultDeptId;
                $scope.getContractList(1,1,true)
            });
        }


        //获取项目部下合同段
        $scope.getContractList = function(deptId, leftTreeType, refresh){
            switch(leftTreeType){
                case 1 :
                $scope.firstLeftTree.deptId = deptId;
                break;
                case 2 :
                $scope.secondLeftTree.deptId = deptId;
            }
            currentContractType = currentContractType?currentContractType:'constructContract';
            commonService.getContractList(deptId,currentContractType).then(function(data){
                $scope.flag.deptRepeatFinish = false;
                var contractList = data.data;
                contractListHtml(contractList,deptId,leftTreeType);//生成合同段列表
                // 如果是刷新 默认展开第一个项目部
                var id = '';
                // 后面做记忆功能要加上判断 session中是否有数据
                if(refresh/* && session != null*/) {
                    // 刷新并且session中无数据 默认展示第一个项目部下的第一个合同段
                    if ($scope.currentRouterNum == 1) {
                        id = 'firstLeftTree';
                    } else if ($scope.currentRouterNum == 2) {
                        id = 'secondLeftTree';
                    } else if ($scope.currentRouterNum == 3) {
                        id = 'thirdLeftTree';
                    } else if ($scope.currentRouterNum == 4) {
                        id = 'fourLeftTree';
                    }
                    $scope.contractName = $($('#' + id + ' li ul li a')[0]).text();
                    $($('#' + id + ' li ul')[0]).css('display', 'block');
                    var id = $($('#' + id + ' li ul a')[0]).attr('id');
                    if (id != null) {
                        var contractId = id.substring('contract_'.length).trim();
                    }
                    if($scope.currentRouterNum == 1) {
                        if ($state.$current.name == 'ld.contractManage'){
                             $scope.getContractInfo1(deptId,contractId);
                        }
                    } else if($scope.currentRouterNum == 2) {
                        if ($state.$current.name == 'ld.projectDivisionContract') {
                            $scope.getContractInfo2(contractId);
                        } else if($state.$current.name == 'ld.listManageContract') {
                            $scope.getContractInfo2(contractId);
                        }
                    } else if($scope.currentRouterNum == 3) {

                    } else if($scope.currentRouterNum == 4) {

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
        function selectProject() {
            $(this).removeClass("selectProject");
            $(this).addClass("selectProject");
        }
        //点击项目部下合同段
        $scope.getContractInfo1 = function(id){
            currentContractId = id;
            $scope.firstLeftTree.contractId = id;
            selectProject()
            $scope.$broadcast('to-ContractManage',$scope.firstLeftTree.deptId, $scope.firstLeftTree.contractId,currentContractType);//传当前合同段的id
            $state.go('ld.contractManage');
        };

        //点击项目部下合同段
        $scope.getContractInfo2 = function(id){
            currentContractId = id;
            $scope.secondLeftTree.contractId = id;
            // 当前页面的路由地址
            var routeUrl = $state.$current.name;
			if(routeUrl == "ld.projectDivisionStake") {
                // 当前页面是工程划分-桩号页面 点击左侧树的合同段 跳转到工程划分-合同段页面
                $state.go('ld.projectDivisionContract');
            } else {
                $scope.$broadcast('to-'+routeUrl, $scope.secondLeftTree.contractId);
            }
        };


        //获取树节点
        $scope.getzTreeNode = function(id,deptId){
            var testParam = {
                id:67,
                nodeType:-1,
                deptId:deptId
            };
            commonService.getTreeNode(testParam).then(function(data){
                zTree = $.fn.zTree.init($("#ztree-"+deptId+"-"+id), setting, data.data);
            });
            /*var data = [];
            data[0] = {"id":0,"nodeNum":"num单位工程","nodeName":"单位工程","nodeType":0,"parentId":0,"isParent":true};
            data[1] = {"id":1,"nodeNum":"num子单位工程","nodeName":"子单位工程","nodeType":1,"parentId":0,"isParent":true};
            data[2] = {"id":2,"nodeNum":"num分部工程","nodeName":"子分部工程","nodeType":2,"parentId":1,"isParent":true};
            data[3] = {"id":3,"nodeNum":"num子分部工程","nodeName":"子分部工程","nodeType":3,"parentId":2,"isParent":true};
            data[4] = {"id":4,"nodeNum":"num分项工程","nodeName":"分项工程","nodeType":4,"parentId":3,"isParent":true};
            data[5] = {"id":5,"nodeNum":"num子分项工程","nodeName":"子分项工程1","nodeType":5,"parentId":4,"isParent":false};
            data[6] = {"id":6,"nodeNum":"num子分项工程","nodeName":"子分项工程2","nodeType":5,"parentId":4,"isParent":false};
            zTree = $.fn.zTree.init($("#ztree-"+deptId+"-"+id), setting, data);*/
        };
        var currentCreateNodeType;
        //新建单位/子单位/分部/子分部/分项/子分项工程弹框
        $scope.createNodeModal = function (iurl,ctrl,createNodeType,size) {
            currentCreateNodeType = createNodeType;
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
                        item.createNodeType = createNodeType; //当前需要创建的节点类型
                        item.currentContractId = currentContractId; //当前合同段ID
                        item.currentNodeName = selectedNodes.nodeName; //当前选中节点的名称
                        return item;
                    }
                }
            });
            modalInstance.result.then(function (createNodeInfo,test) {
                //获取子节点参数拼接
                var getNodeInfo = {
                    id: createNodeInfo.parentId,
                    nodeType: selectedNodes.nodeType
                };
                if(currentCreateNodeType == 5){
                    /**
                     * 创建子分项工程分两种情况
                     * 1.右键选中的是分项工程2.右键选中的是子分项工程
                     */
                    if(currentCreateNodeType != selectedNodes.nodeType){
                        var tempdata = [];
                        tempdata[0] = selectedNodes.nodeName;
                        getNodeInfo.id =  selectedNodes.id;//创建类型不同情况下id为当前选中节点的id
                    } else {
                        var tempdata = [];
                        getNodeInfo.id =  selectedNodes.parentId; //创建类型相同的情况下id为当前选中节点的父id
                    }
                    var parentNodesName = getParentNodesName(selectedNodes,tempdata);
                    createNodeInfo.unitProjectName = parentNodesName[1];
                    createNodeInfo.deptProjectName = parentNodesName[0];
                    createNodeInfo.sectionContractId = $scope.secondLeftTree.contractId;
                    // console.log(parentNodesName,'getParentNodesName')
                    //创建子分项工程
                        commonService.createChildItemized(createNodeInfo).then(function(data){
                            /**
                             * 获取子节点(获取当前节点下所有的数据)
                             * 若当前只有单位工程，id:当前合同段 nodetype:-1
                             * 若当前节点不止单位工程，id:当前选中节点的id nodetype不传
                             */
                            commonService.getTreeNode(getNodeInfo).then(function(data){
                                addTreeNode(data.data);
                            });
                        })
                } else {
                    //创建树节点
                    commonService.createTreeNode(createNodeInfo).then(function(data){
                        /**
                         * 获取子节点(获取当前节点下所有的数据)
                         * 若当前只有单位工程，id:当前合同段 nodetype:-1
                         * 若当前节点不止单位工程，id:当前选中节点的id nodetype不传
                         */
                        commonService.getTreeNode(getNodeInfo).then(function(data){
                            addTreeNode(data.data);
                        });
                    })
                }


                
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
                    enable: true,
                    idKey: "id",
                    pIdKey: "parentId",
                    rootPId:null
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
            //$scope.name="hello1";
            var zTree = $.fn.zTree.getZTreeObj($scope.ztreeOpenId),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];

            // 只有是第5级树节点 即当前节点是子分项工程 点击才跳页面
            if(treeNode.nodeType == 5) {
                if($state.$current.name == "ld.projectDivisionContract" || $state.$current.name == "ld.projectDivisionStake") {
                    // 通过左侧树拿到工程划分-桩号页面需要展示的数据
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
                } else if($state.$current.name == "ld.listManageContract" || $state.$current.name == "ld.listManageItemized") {
                    // 跳转到清单管理-桩号页面

                    // 通过左侧树拿到清单管理-桩号页面需要展示的数据
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
                    $scope.$broadcast('to-listManageItemized', $scope.stakeInfo, $scope.openPpid);//传值
                    $state.go('ld.listManageItemized');









                    

                }

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
        //递归获取传入节点的单位工程和分项工程名称
        function getParentNodesName(treeObj,parentNodesNameArr){
            if(treeObj==null)return "";
            var pNode = treeObj.getParentNode();
            if(pNode!=null && (pNode.nodeType === 4 || pNode.nodeType === 0)){
                parentNodesNameArr.push(pNode.nodeName);
            }
            if(pNode!=null){
                getParentNodesName(pNode,parentNodesNameArr);
            }
            return parentNodesNameArr;
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

        //单位工程名称
        commonService.getDefaultNodeName(1).then(function(data){
            staticData.defaultNodeName.unitNameArr = data.data;
        });
        //分部工程名称
        commonService.getDefaultNodeName(2).then(function(data){
            staticData.defaultNodeName.partNameArr = data.data;
        });
        //分项工程名称
        commonService.getDefaultNodeName(3).then(function(data){
            staticData.defaultNodeName.itemNameArr = data.data;
        });

        //=====我是合同管理分割线
        

        //======我是变更管理分割线=======
        
        
    }]);