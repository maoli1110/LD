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
        };
        $scope.secondLeftTree = {
            deptId:null,
            contractId:null
        };
        $scope.thirdLeftTree = {
            deptId:null,
            contractId:null
        };
        $scope.fourLeftTree = {
            deptId:null,
            contractId:null
        };
        /**
         * 当前合同类型 1施工合同 2监理合同 3监理实验室合同
         * constructContract  1
         */
        var currentContractType;
        //根据子级的路由变化改变父级左侧树
        $scope.$on('changeRouter',function(event,currentRouterNum){
            $scope.currentRouterNum = currentRouterNum;
        });

        //首次进入页面或者F5刷新，项目部repeat完成之后的动作
        $scope.$on('deptNgRepeatFinished',function(event){
            var deptId = null;
            if($scope.currentRouterNum == 1 && $scope.firstLeftTree.contractId == null) {
                deptId = $scope.firstLeftTree.deptId;
            } else if($scope.currentRouterNum == 2 && $scope.secondLeftTree.contractId == null) {
                deptId = $scope.secondLeftTree.deptId;
            } else if($scope.currentRouterNum == 3 && $scope.thirdLeftTree.contractId == null) {
                deptId = $scope.secondLeftTree.deptId;
            } else if($scope.currentRouterNum == 4 && $scope.fourLeftTree.contractId == null) {
                deptId = $scope.secondLeftTree.deptId;
            }
            if(deptId != null) {
                $scope.getContractList(deptId, $scope.currentRouterNum, true);
            }
        });

        $scope.flag={};

        //tree 设置
        var $body= $("body");
        var zTree, //ztree对象
            selectedNodes; //当前选中的节点
        var rMenu = $("#rMenu");
        var currentContractId;//当前选中的合同段

        //获取项目部
        commonService.getDept().then(function(data){
            // 设置合同类型为施工合同
            currentContractType = 1;
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
                //首次加载默认deptId是第一个
                var defaultDeptId = data[0].deptId;
                $scope.firstLeftTree.deptId = defaultDeptId;
                $scope.getContractList(defaultDeptId,1,true);
            });
        };

        /**
         * 根据项目部id获取项目部下合同段信息
         * @param deptId 项目部id
         * @param leftTreeType 左侧树类型 1,2,3,4
         * @param refresh 是否是刷新 传true或false
         */
        $scope.getContractList = function(deptId, leftTreeType, refresh){
            if(leftTreeType == null) leftTreeType = $scope.currentRouterNum;
            switch(leftTreeType){
                case 1 :
                    $scope.firstLeftTree.deptId = deptId;
                    break;
                case 2 :
                    $scope.secondLeftTree.deptId = deptId;
                    break;
                case 3 :
                    $scope.thirdLeftTree.deptId = deptId;
                    break;
                case 4 :
                    $scope.fourLeftTree.deptId = deptId;
            }
            // currentContractType 1施工合同
            currentContractType = currentContractType?currentContractType:1;
            commonService.getContractList(deptId,currentContractType).then(function(data){
                $scope.flag.deptRepeatFinish = false;
                var contractList = data.data;
                contractListHtml(contractList,deptId,leftTreeType);//生成合同段列表
                // 如果是刷新 默认展开第一个项目部
                var leftTreeId = '';
                // 后面做记忆功能要加上判断 session中是否有数据
                if(refresh/* && session != null*/) {
                    // 刷新并且session中无数据 默认展示第一个项目部下的第一个合同段
                    if (leftTreeType == 1) {
                        leftTreeId = 'firstLeftTree';
                    } else if (leftTreeType == 2) {
                        leftTreeId = 'secondLeftTree';
                    } else if (leftTreeType == 3) {
                        leftTreeId = 'thirdLeftTree';
                    } else if (leftTreeType == 4) {
                        leftTreeId = 'fourLeftTree';
                    }
                    // 设置第一个项目部下的第一个合同段显示
                    $($('#' + leftTreeId + ' li ul')[0]).css('display', 'block');
                    var contractIdStr = $($('#' + leftTreeId + ' li ul a')[0]).attr('id');
                    if (contractIdStr != null) {
                        var contractId = contractIdStr.substring('contract_'.length).trim();
                    }
                    if(leftTreeType == 1) {  // 第一种左侧树跳转
                        $scope.getContractInfo1(deptId,contractId);
                    } else if(leftTreeType == 2) {  // 第二种左侧树跳转
                        $scope.getContractInfo2(contractId);
                    } else if(leftTreeType == 3) {  // 第三种左侧树跳转
                        $scope.getContractInfo3(contractId);
                    } else if(leftTreeType == 4) {  // 第四种左侧树跳转
                        $scope.getContractInfo4(contractId);
                    }
                }
            });
        };

        //生成合同段列表
        function contractListHtml(contractList,deptId,leftTreeType) {
            // 清空左侧树下合同段的内容
            $("#ul"+leftTreeType+"-"+deptId).empty();
            if(leftTreeType == 1){
                $('#rMenu').css('display', 'none');
                // 第一种左侧树的html拼接
                angular.forEach(contractList,function(value,key){
                    var li = '<li class="contract-name active">';
                    li += '      <a ng-click="getContractInfo1('+value.id+')" id="contract_'+value.id+'" ppid="'+value.ppid+'"';
                    if(key == 0) {  // 默认第一个合同段是选中状态
                        li += 'class="active" ';
                    }
                    li += '>'+value.sectionNum;
                    li += '</li>';
                    var template = $compile(li)($scope);
                    angular.element(document.getElementById("ul1-" + deptId)).append(template);
                });
            } else if(leftTreeType == 2){
                $('#rMenu').css('display', 'block');
                // 第二种左侧树的html拼接
                angular.forEach(contractList,function(value,key){
                    var li = '<li class="contract-name active">';
                    li += '      <a ng-click="getContractInfo2('+value.id+')" id="contract_'+value.id+'" ppid="'+value.ppid+'"';
                    if(key == 0) {  // 默认第一个合同段是选中状态
                        li += 'class="active" ';
                    }
                    li += '><strong style="font-weight: 700;">'+value.sectionNum+'</strong>';
                    li += '      <i class="icon icon-down" ng-click="getzTreeNode('+value.id+','+deptId+')" id="'+value.id+'"><div class="icon-child icon-x-down"></div><div class="icon-child icon-y-down"></div></i>';
                    li += '      </a>';
                    li += '      <ul id="ztree-'+deptId+'-'+value.id+'" class="ztree" style="display: none;"></ul>';
                    li += '</li>';
                    var template = $compile(li)($scope);
                    angular.element(document.getElementById("ul2-"+deptId)).append(template);
                });
                // 第二种左侧树向下箭头的点击事件
                $('.icon').click(function (ele) {
                    var tree = $(ele.target).parent().siblings('ul');
                    if(tree.length == 0) {  // 用户可能点到icon下面的子元素了
                        tree = $(ele.target).parent().parent().siblings('ul');
                        ele.target = $(ele.target).parent();
                    }
                    if (tree.css('display') === 'none') {
                        tree.slideDown(300);
                        $(ele.target).removeClass('icon-down').addClass('icon-up');
                        $($(ele.target).children()[0]).removeClass('icon-x-down').addClass('icon-x-up');
                        $($(ele.target).children()[1]).removeClass('icon-y-down').addClass('icon-y-up');
                        ztreeOpen = true;
                        $scope.ztreeOpenId = tree.attr("id");
                        $scope.openPpid = $(ele.target).parent().attr('ppid');
                    } else {
                        tree.slideUp(300);
                        $(ele.target).removeClass('icon-up').addClass('icon-down');
                        $($(ele.target).children()[0]).removeClass('icon-x-up').addClass('icon-x-down');
                        $($(ele.target).children()[1]).removeClass('icon-y-up').addClass('icon-y-down');
                        ztreeOpen = false;
                    }
                    $(ele.target).parent().parent().siblings().find('>ul').slideUp(300);
                    var icon = $(ele.target).parent().parent().siblings().find('.icon');
                    icon.removeClass('icon-up').addClass('icon-down');
                    var children = icon.children();
                    for(var i = 0; i < children.length; i++){
                        if(i % 2 == 0) {
                            $(icon.children()[i]).removeClass('icon-x-up').addClass('icon-x-down');
                        } else {
                            $(icon.children()[i]).removeClass('icon-y-up').addClass('icon-y-down');
                        }
                    }
                });
            } else if(leftTreeType == 3){
                // TODO 第三种左侧树的html拼接
                angular.forEach(contractList,function(value,key){
                    var li = '';
                    var template = $compile(li)($scope);
                    angular.element(document.getElementById("ul3-"+deptId)).append(template);
                });
            } else if(leftTreeType == 4){
                // TODO 第四种左侧树的html拼接
                angular.forEach(contractList,function(value,key){
                    var li = '';
                    var template = $compile(li)($scope);
                    angular.element(document.getElementById("ul4-"+deptId)).append(template);
                });
            }
            // 点击合同段时样式改变事件
            $('.contract-name > a').on('click', function () {
                $(this).addClass('active').parent().siblings().find('>a').removeClass('active');
            });
        }
        
        $scope.select = function (ele) {
            $(".select").removeClass("select");
            $(ele).addClass("select");
        };
        /**
         * 第一种左侧树属性值设置和跳转页面
         * @param deptId 项目部id
         * @param id 合同段id
         */
        $scope.getContractInfo1 = function (deptId, id) {
            currentContractId = id;
            $scope.firstLeftTree.contractId = id;
            $scope.firstLeftTree.deptId = deptId;
            // selectProject()
            $scope.$broadcast('to-ContractManage', $scope.firstLeftTree.contractId, currentContractType);//传当前合同段的id
            $state.go('ld.contractManage');
        };

        /**
         * 第二种左侧树属性值设置和跳转页面
         * @param id 合同段id
         */
        $scope.getContractInfo2 = function(id){
            currentContractId = id;
            $scope.secondLeftTree.contractId = id;
            // 获取合同段名称
            $scope.contractName = $("#contract_"+id).text().trim();
            // 当前页面的路由地址
            var routeUrl = $state.$current.name;
            if(routeUrl == "ld.projectDivisionStake") {
                // 当前页面是工程划分-桩号页面 点击左侧树的合同段 跳转到工程划分-合同段页面
                $state.go('ld.projectDivisionContract');
            }else if(routeUrl =="ld.listManageItemized"){
                $state.go('ld.listManageContract');

            } else {
                $scope.$broadcast('to-'+routeUrl, $scope.secondLeftTree.contractId);
            }
        };

        /**
         * 第三种左侧树属性值设置和跳转页面
         * @param id 合同段id
         */
        $scope.getContractInfo3 = function(id){
            // TODO
        };

        /**
         * 第四种左侧树属性值设置和跳转页面
         * @param id 合同段id
         */
        $scope.getContractInfo4 = function(id){
            // TODO
        };


        //获取树节点
        $scope.getzTreeNode = function(id,deptId){
            var testParam = {
                id:id,
                nodeType:-1,
                deptId:deptId
            };
            commonService.getTreeNode(testParam).then(function(data){
                zTree = $.fn.zTree.init($("#ztree-"+deptId+"-"+id), setting, data.data);
            });
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
            modalInstance.result.then(function (createNodeInfo) {
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
                    var tempdata = [];
                    if(currentCreateNodeType != selectedNodes.nodeType){
                        tempdata[0] = selectedNodes.nodeName;
                        getNodeInfo.id =  selectedNodes.id;//创建类型不同情况下id为当前选中节点的id
                    } else {
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
                onRightClick: OnRightClick,
                beforeRename: beforeRename,
                onRename:onRename
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
            if(treeNode.nodeType != 5) return;
            // 通过左侧树拿到右侧页面需要展示的数据
            var itemized = treeNode.getParentNode();    // 分项
            var childDeptProject = itemized.getParentNode();    // 子分部
            var deptProject = childDeptProject.getParentNode();    // 分部
            var childUnitProject = deptProject.getParentNode();    // 子单位
            var unitProject = childUnitProject.getParentNode();    // 单位

            $scope.stakeInfo = {
                'contractId':$scope.secondLeftTree.contractId, //合同段id
                'contractName':$('#'+$scope.ztreeOpenId).prev().text(), // 合同段名字
                'unitProjectName':unitProject.nodeName, 'unitProjectNameNum':unitProject.nodeNum, // 单位名称
                'childUnitProjectName':childUnitProject.nodeName,    // 子单位
                'deptProjectName':deptProject.nodeName,'deptProjectNameNum':deptProject.nodeNum, // 分部名称
                'childDeptProjectName':childDeptProject.nodeName, // 子分部
                'itemizedName':itemized.nodeName,'itemizedNameNum':treeNode.nodeNum,   // 分项
                'childItemizedName':treeNode.nodeName,   // 子分项名称
                'treeId':treeNode.id  // 左侧树的id
            };

            var toUrl = null;
            if($state.$current.name == "ld.projectDivisionContract" || $state.$current.name == "ld.projectDivisionStake") {
                // 跳转到分项工程
                toUrl = 'projectDivisionStake';
            } else if($state.$current.name == "ld.listManageContract" || $state.$current.name == "ld.listManageItemized") {
                // 跳转到清单管理-桩号页面
                toUrl = 'listManageItemized';
            }
            if(toUrl == null) return;
            $scope.$broadcast('to-'+toUrl, $scope.stakeInfo, $scope.openPpid);//传值
            $state.go('ld.'+toUrl);
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
            $("#rMenu .sub-operation > li").css('display','none');
            $("body").bind("mousedown", onBodyMouseDown);
        }
        //隐藏右键菜单
        function hideRMenu() {
            if (rMenu) rMenu.css({"visibility": "hidden"});
            $("#rMenu .operation").css('visibility','hidden');
            $("#rMenu .sub-operation-move").css('visibility','hidden');
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
            $scope.msg = "确认删除此节点？";
            if ((treeNode != null && treeNode.child && treeNode.child.length>0) || treeNode.isParent) {
                //父部门的情况
                $scope.msg = "此节点有下级节点，确认删除吗？";
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
                    zTree.removeNode(treeNode); //删除树节点
                });
            }, function () {
                //console.info('Modal dismissed at: ' + new Date());
                console.log('取消删除树节点');
            });
        };

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

        function beforeRename(treeId, treeNode, newName, isCancel) {
            if (newName.length == 0) {
                alert("节点名称不能为空.");
                var zTree = $.fn.zTree.getZTreeObj($scope.ztreeOpenId);
                setTimeout(function(){zTree.editName(treeNode)}, 10);
                return false; 
            }
            return true;
        }

        function onRename(e, treeId, treeNode, isCancel) {
            var param = {
                id:treeNode.id,
                nodeName:treeNode.nodeName,
                nodeType:treeNode.nodeType
            }
            commonService.updateChildProjectName(param).then(function(){
                alert('success')
            });
            // showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
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
                resetOperationMenu();
                // $("#rMenu .sub-operation-move").css('visibility','hidden');
                // $("#rMenu .sub-operation").css('display','block');
                // $("#rMenu .sub-operation > li").css('display','none');
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
                        break;
                }

            });
            //移动-显示二级菜单
            $("#m_move").mouseover(function(){
                $("#rMenu .sub-operation>li").css('display','none');
                $("#rMenu .sub-operation-move").css('visibility','visible');
            });
            //鼠标滑开rMenu区域的操作
            $("#rMenu").mouseleave(function(){
                hideRMenu();
            });

            //删除
            $("#m_del").on("click",function(){
                removeTreeNode();
            });

            //重命名
            $("#m_edit").on("click",function(){
                renameTreeNode()
            });

            //上移节点
            $("#m_move_up").on("click",function(){
                moveUpTreeNode();
            });

            //下移节点
            $("#m_move_down").on("click",function(){
                moveDownTreeNode();
            });

            /**
             * 隐藏添加菜单
             * 隐藏移动菜单
             */
            function resetOperationMenu(){
                $("#rMenu .sub-operation > li").css('display','none');
                $("#rMenu .sub-operation-move").css('visibility','hidden');
            }
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