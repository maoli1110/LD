'use strict';

angular.module('core').service('commonService', function ($http, $q) {

    // var url = "http://"+dbPort+"/rest/";
    var url = "http://192.168.13.215:8080/LBLD/rs/";

    /**
     * [testApi get-jquery-版本]
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    this.testApi = function (param) {
        // param = JSON.stringify(param);
        var delay = $q.defer();
        $.ajax({
            type: "GET",
            url: url + 'feedback/problem/attach/' + param,
            contentType: 'application/json;',
            success: function (data) {
                delay.resolve(data);
            },
            error: function (error) {
                delay.reject(JSON.parse(error.responseText));
            }
        });
        return delay.promise;
    };


    //获取后台数据503错误解决示例getData
    this.getData = function (params) {
        var delay = $q.defer();
        var url_join = 'json/data.json';
        $http.get(url_join, {transformRequest: angular.identity}).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    //获取后台数据503错误解决示例postData
    this.postData = function (obj) {
        var delay = $q.defer();
        var url_join = url + "rs/trends/projectTrends";
        $http.post(url_join, obj, {transformRequest: angular.identity}).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    //获取树节点
    this.getzTreeData = function () {
        var delay = $q.defer();
        var url_join = url + "";
        $http.get('./json/simpleTree.json').then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    /**
     * 创建树节点
     * @param {string} nodeNum  节点编码
     * @param {string} nodeName 节点名称
     * @param {string} nodeType 节点类型(0单位，1子单位，2分项，3子分项，4分部，5子分部)
     * @param {string} parentId 父节点Id
     */
    this.createTreeNode = function (param) {
        param = JSON.stringify(param);
        var delay = $q.defer();
        var url_join = url + 'projectTreeService/createProjectTreeNode';
        $http.post(url_join, param, {transformRequest: angular.identity}).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    /**
     * 树节点排序
     * @param treeIds 当前层级下所有树节点id
     * @returns {*}
     */
    this.sortNodes = function (treeIds) {
        treeIds = JSON.stringify(treeIds);
        var delay = $q.defer();
        $.ajax({
            type: "POST",
            url: url + 'projectTreeService/sortNodes',
            contentType: 'application/json;',
            data: treeIds,
            success: function (data) {
                delay.resolve(data);
            },
            error: function (error) {
                delay.reject(JSON.parse(error.responseText));
            }
        });
        return delay.promise;
    };
    /**
     * 更新子工程名称
     * @param {string} nodeNum  节点编码
     * @param {string} nodeName 节点名称
     * @param {string} nodeType 节点类型(0单位，1子单位，2分项，3子分项，4分部，5子分部)
     * @param {string} parentId 父节点Id
     */
    this.updateChildProjectName = function (param) {
        param = {
            nodeNum: "TREE002",
            nodeName: "子单位工程",
            nodeType: -1,
            parentId: 1
        };
        param = JSON.stringify(param);
        var delay = $q.defer();
        $.ajax({
            type: "POST",
            url: url + 'projectTreeService/updateChildProjectName',
            contentType: 'application/json;',
            data: param,
            success: function (data) {
                delay.resolve(data);
            },
            error: function (error) {
                delay.reject(JSON.parse(error.responseText));
            }
        });
        return delay.promise;
    };

    /**
     * 获取子节点
     * @param  {string} id 当前节点的id(没有任何树节点的情况下 id为合同段)
     * @return {string} nodetype节点类型(根据合同段获取单位工程时nodetype=-1,其它都是节点类型)
     * 备注:nodetype（0单位，1子单位，2分项，3子分项，4分部，5子分部）
     */
    this.getTreeNode = function (param) {
        var delay = $q.defer();
        var url_join = url + "projectTreeService/findChildNodesByParent/" + param.id + "/" + param.nodeType;
        var url_test = "./json/simpleTree.json";
        $http.get(url_join).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    //GET /projectTreeService/deleteTreeNode/{id}/{contractId}
    /**
     * 通过树节点id和合同段id删除树节点
     * @param treeNodeId 树节点id
     * @param contractId 合同段id
     * @returns {*}
     */
    this.deleteTreeNode = function (treeNodeId, contractId) {
        var delay = $q.defer();
        var url_join = url + "projectTreeService/deleteTreeNode/" + treeNodeId + "/" + contractId;
        $http.get(url_join).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    //获取项目部
    this.getDept = function () {
        var delay = $q.defer();
        var url_join = url + "orgnization/getDeptInfos";
        $http.post(url_join).then(function (data) {
            delay.resolve(data.data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    this.getContractList = function (deptId, contractType) {
        var delay = $q.defer();
        if(deptId == null) {
            return delay.promise;
        }
        var url_join;
        switch (contractType) {
            //获取项目部下施工合同段
            case 'constructContract' :
                url_join = url + "contracts/construction?deptId=" + deptId;
                break;
            //获取项目部下监理合同段
            case 'superviseContract':
                url_join = url + "contracts/supervision?deptId=" + deptId;
                break;
            //获取项目部下监理试验室合同段
            case 'labContract':
                url_join = url + "contracts/supervisionLaboratory?deptId=" + deptId;
                break;
        }

        $http.get(url_join, {'withCredentials': true}).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    /**
     *
     * @param params
     * @returns {*}
     */
    this.projectTreeService = function (params) {
        var delay = $q.defer();
        var url_join = url + "contracts/construction?deptId=" + deptId;
        var test_join = './json/contractList.json';
        $http.get(url_join, {'withCredentials': true}).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    /**
     * 获取工程划分-合同段页面展示数据，对应到后端在子分项工程下
     * @param pageParam {pageSize: 15,pageNumber: 1,queryParam: "00",sortField: "id",sortType: "desc"}
     * @param sectionContractId 合同段id
     * @returns {"totalElements": 1,"size": 15,"number": 1,"totalPages": 1,
                "content": [{"id": 8,"unitProjectName": "单位工程节点01","deptProjectName": "分部工程001",
                    "childItemizedName": "子分项工程001","childItemizedNum": "GK3+354.115~GK3+454.265","createTime": 1493798872000}
                ]}
     */
    this.findChildItemizedInfos = function (pageParam, sectionContractId) {
        var delay = $q.defer();
        // 刷新页面时 sectionContractId有可能是空
        if (sectionContractId == null) {
            return delay.promise;
        }
        pageParam = JSON.stringify(pageParam);
        var url_join = url + 'childItemizedService/findChildItemizedInfos/' + sectionContractId;
        $http.post(url_join, pageParam, {transformRequest: angular.identity}).then(function (data) {
            // 后台返回的当前页码是从0开始，此处先加1
            ++data.data.number;
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });

        return delay.promise;
    };
    /**
     * 查询子分项明细信息
     * @param treeNodeId
     * @returns {"id": 1,"stakeMark": "桩号","contractPictureNum": "合同图号","compGroupId": "构件组id","compGroupName": "构件组名称"}
     */
    this.findChildItemizedDetail = function (treeNodeId) {
        var delay = $q.defer();
        var url_join = url + "childItemizedService/findChildItemizedDetail/" + treeNodeId;
        $http.get(url_join, {'withCredentials': true}).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    /**
     * 修改子分项工程下的合同图号
     * @param childItemId 子分项工程
     * @param contractPictureNum 合同图号
     * @returns 无返回值
     */
    this.updateContractPictureNum = function (childItemId, contractPictureNum) {
        var delay = $q.defer();
        var url_join = url + "childItemizedService/updateContractPictureNum/" + childItemId + '/' + contractPictureNum;
        $http.get(url_join, {'withCredentials': true}).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    /**
     * 通过ppid获取构件组信息
     * @param ppid
     * @returns [{"compGroupId": "string","name": "string"}]
     */
    this.findCompGroupsByPpid = function (ppid) {
        var delay = $q.defer();
        var url_join = url + "childItemizedService/findCompGroupsByPpid/" + ppid;
        $http.get(url_join, {'withCredentials': true}).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    /**
     * 根据子分项工程id和构件组id修改子分项工程下关联的构件组
     * @param childItemId 子分项工程id
     * @param compGroupId 构件组id
     * @returns 无返回值
     */
    this.updateCompGroupId = function (childItemId, compGroupId) {
        var delay = $q.defer();
        var url_join = url + "childItemizedService/updateCompGroupId/" + childItemId + "/" + compGroupId;
        $http.get(url_join, {'withCredentials': true}).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    /**
     * 获取施工合同展示数据
     */
    this.getConstructConstractInfos = function (constractId,contractType) {
        var delay = $q.defer();
        var url_join;
        switch (contractType) {
            //获取项目部下施工合同段
            case 'constructContract' :
                url_join = url + 'contracts/construction/' + constractId;
                break;
            //获取项目部下监理合同段
            case 'superviseContract':
                url_join = url + 'contracts/supervision/' + constractId;
                break;
            //获取项目部下监理试验室合同段
            case 'labContract':
                url_join = url + 'contracts/supervisionLaboratory/' + constractId;
                break;
        }
        $.ajax({
            type: "GET",
            url: url_join,
            contentType: 'application/json',
            success: function (data) {
                delay.resolve(data);
            },
            error: function (error) {
                delay.reject(JSON.parse(error.responseText));
            }
        });
        return delay.promise;
    };

    // 新增和编辑施工合同
    this.createConstruction = function (sendConstructContent) {
        sendConstructContent = JSON.stringify(sendConstructContent);
        var delay = $q.defer();
        $.ajax({
            type: "POST",
            url: url + 'contracts/construction',
            contentType: 'application/json;',
            data: sendConstructContent,
            success: function (data) {
                delay.resolve(data);
            },
            error: function (error) {
                delay.reject(JSON.parse(error.responseText));
            }
        });
        return delay.promise;
    };
    // 新增和编辑监理合同
    this.createSupervision = function (sendSupervisionContent) {
        sendSupervisionContent = JSON.stringify(sendSupervisionContent);
        var delay = $q.defer();
        $.ajax({
            type: "POST",
            url: url + 'contracts/supervision',
            contentType: 'application/json;',
            data: sendSupervisionContent,
            success: function (data) {
                delay.resolve(data);
            },
            error: function (error) {
                delay.reject(JSON.parse(error.responseText));
            }
        });
        return delay.promise;
    };
    // 新增和编辑监理试验室合同
    this.createSupervisionLaboratory = function (sendSupervisionLabContent) {
        sendSupervisionLabContent = JSON.stringify(sendSupervisionLabContent);
        var delay = $q.defer();
        $.ajax({
            type: "POST",
            url: url + 'contracts/supervisionLaboratory',
            contentType: 'application/json;',
            data: sendSupervisionLabContent,
            success: function (data) {
                delay.resolve(data);
            },
            error: function (error) {
                delay.reject(JSON.parse(error.responseText));
            }
        });
        return delay.promise;
    };

    // 删除施工合同
    // /contracts/construction/delete/{id}
    this.deleteConstruction = function (id) {
        var delay = $q.defer();
        var url_join = url + "contracts/construction/delete/" + id;
        $http.get(url_join, {'withCredentials': true}).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    // 删除监理合同
    // /contracts/supervision/delete/{id}
    this.deleteSupervision = function (id) {
        var delay = $q.defer();
        var url_join = url + "contracts/supervision/delete/" + id;
        $http.get(url_join, {'withCredentials': true}).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    // 删除监理试验室合同
    // /contracts/supervisionLaboratory/delete/{id}
    this.deleteSupervisionLaboratory = function (id) {
        var delay = $q.defer();
        var url_join = url + "contracts/supervisionLaboratory/delete/" + id;
        $http.get(url_join, {'withCredentials': true}).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    // 删除合同附件post
    // /contracts/files/{id}
    this.deleteContractAttachment = function (id) {
        var delay = $q.defer();
        $.ajax({
            type: "POST",
            url: url + 'contracts/files/' + id,
            contentType: 'application/json;',
            success: function (data) {
                delay.resolve(data);
            },
            error: function (error) {
                delay.reject(JSON.parse(error.responseText));
            }
        });
        return delay.promise;
    }

    // 关联工程树
    this.getProjectTree = function () {
        var delay = $q.defer();
        var url_join = url + "orgnization/projectTree";
        $http.get(url_join, {'withCredentials': true}).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    /**
     * 分页查询合同清单列表
     */
   this.getContractlist = function (contractId,chapterId,pageParam) {
        var delay = $q.defer();
        if(contractId == null) {
            return delay.promise;
        }
        pageParam = JSON.stringify(pageParam);
        var url_join = url + 'contractlist/'+ contractId +'/'+chapterId;
        $http.post(url_join, pageParam, {transformRequest: angular.identity}).then(function (data) {
            // 后台返回的当前页码是从0开始，此处先加1
            ++data.data.number;
            delay.resolve(data.data);
        }, function (error) {
            delay.reject(error);
        });

        return delay.promise;
    };


     /**
     * 分页查询桩号清单列表
     */
     this.getItemizedlist = function (itemizedId,chapterId,pageParam) {
        pageParam = JSON.stringify(pageParam);
        var delay = $q.defer();
        if(itemizedId == null) {
            return delay.promise;
        }
        var url_join = url + 'contractlist/'+ itemizedId +'/'+chapterId;
        //var url_test = './json/list.json';
        $http.post(url_join, pageParam, {transformRequest: angular.identity}).then(function (data) {
            // 后台返回的当前页码是从0开始，此处先加1
            ++data.data.number;
            delay.resolve(data.data);
        }, function (error) {
            delay.reject(error);
        });

        return delay.promise;
    };

    /**
     * 导入合同清单
     */

    this.uploadContractlist = function (contractId) {
        var delay = $q.defer();
        var url_join = url + 'contractlist/' + contractId;
       $http.post(url_join).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };


    /**
     * 导出合同清单
     */
    this.contractlistDownload = function (contractId) {
        var delay = $q.defer();
        var url_join = url + 'contractlist/' + contractId + '/download';
       $http.get(url_join).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    /**
     * 导出桩号清单接口
     */
    this.itemizedlistDownload = function (itemizedId) {
        var delay = $q.defer();
         var url_join = url + 'itemizedlist/' + itemizedId + '/download';
       $http.get(url_join).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;

    };

    /**
     * 清空合同清单接口
     */
    this.ContractlistClear = function (contractId) {
        var delay = $q.defer();
        var url_join = url + 'contractlist/' + contractId + '/clear';
       $http.get(url_join).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };


    /**
     * 清空桩号清单接口
     */
    this.ItemizedlistClear = function (itemizedId) {
        var delay = $q.defer();
        var url_join = url + 'itemizedlist/' + itemizedId + '/clear';
       $http.get(url_join).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    

    /*
     * 查询合同清单中的章
     */
    this.contractlistChapters = function (contractId) {
        var delay = $q.defer();
        if(contractId == null) {
            return delay.promise;
        }
       var url_join = url + 'contractlist/' + contractId + '/chapters';
       $http.get(url_join).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };


    /*
     * 查询清单桩号中的章
     */
    this.itemizedIdlistChapters = function (itemizedId) {
        var delay = $q.defer();
        if(itemizedId == null) {
            return delay.promise;
        }

        var url_join = url + 'itemizedlist/' + itemizedId + '/chapters';
        $http.get(url_join).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };


    /**
     * 保存图纸工程量
     */
    this.saveItemizedlist = function (itemizedId, pageParam) {
        pageParam = JSON.stringify(pageParam);
        var delay = $q.defer();
        var url_join = url + 'itemizedlist/' + itemizedId;
        $http.post(url_join, pageParam, {transformRequest: angular.identity}).then(function (data) {
            delay.resolve(data.data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };


    /**
     * 提交桩号清单
     */

    this.submitItemizedlist = function (itemizedId) {
        var delay = $q.defer();
        var url_join = url + 'itemizedlist/' + itemizedId + '/submit';
        $http.post(url_join, {transformRequest: angular.identity}).then(function (data) {
            delay.resolve(data.data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    /**
     * 提交合同清单
     */
    this.submitContractlist = function (contractId) {
        var delay = $q.defer();
        var url_join = url + 'contractlist/' + contractId + '/submit';
        $http.post(url_join, {transformRequest: angular.identity}).then(function (data) {
            delay.resolve(data.data);
        }, function (error) {
            delay.reject(error);
        });

        return delay.promise;
    };

    //导出清单
    this.downloadItemizedlist = function (itemizedId) {
        var delay = $q.defer();
        //pageParam = JSON.stringify(pageParam);
        var url_join = url + 'itemizedlist/'+ itemizedId +'/download';
        $http.get(url_join , {
          parameter:""
        },{
            responseparameterType: 'arraybuffer'
        }).then(function (res) {
            var blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
            var fileName = 'Download itemizedList.xls';
            downFile(blob, fileName);
        });

        return delay.promise;
    };



    /**
     * [获取单位工程、分部工程、分项工程默认名称]
     * @param  {string} 1单位工程,2分部工程,3分项工程
     * @return {[type]} [description]
     */
    this.getDefaultNodeName = function (param){
        var delay = $q.defer();
        var url_join = url + "contracts/construction/delete/" + param;
        var test_join = './json/unitName.json';
        $http.get(test_join, {'withCredentials': true}).then(function (data) {
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    }

    /**
     * 获取当前路由编号
     * [getCurrentRouterNum description]
     * @param  {string} currentRouterName 当前路由名称
     * @return {int} 1 2 3 4 分别代表不同的左侧树结构
     */
    this.getCurrentRouterNum = function (currentRouterName) {
        var firstCategory = ['ld.contractManage']
        var secondCategory = ['ld.projectDivisionContract', 'ld.projectDivisionStake', 'ld.listManageContract'];
        var thirdCategory = ['ld.projectChange','ld.projectChangeStake'];
        var fourCategory = [''];
        if (firstCategory.indexOf(currentRouterName) !== -1) {
            return 1;
        } else if (secondCategory.indexOf(currentRouterName) !== -1) {
            return 2;
        } else if (thirdCategory.indexOf(currentRouterName) !== -1) {
            return 3;
        } else if (thirdCategory.indexOf(currentRouterName) !== -1) {
            return 4;
        }
    }

    //心跳机制
    function getheartBeat() {
        var delay = $q.defer();
        var url_join= url+"heartBeat";
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
            delay.reject(data);
        });
        return delay.promise;
    };

    function refreshState() {
        getheartBeat().then(function(){});
    }

    //设置间隔获取状态
    this.heartBeat = function () {
        ApplicationConfiguration.refreshID = setInterval(refreshState, 20*60*1000);
        // ApplicationConfiguration.refreshID = setInterval(refreshState, 10*1000);
    }

    // 树节点展开或关闭  e={type:"",operObj:"",level: 1}
    // 展开e.type="expand"  收起e.type="collapse"		e.operObj对应树节点信息ul的id
    // e.level:当前展开到第几层
    this.openOrClose = function (e){
        var level = e.level;	// 当前展开到第几层
        var type = e.type;	// 展开e.type="expand"  收起e.type="collapse"
        var operObj = e.operObj;	// e.operObj对应树节点信息ul的id

        var zTree = $.fn.zTree.getZTreeObj(operObj);
        var treeNodes = zTree.transformToArray(zTree.getNodes());
        var flag=true;
        var maxLevel=-1;	// 该树的最大层数
        //点击展开、折叠的时候需要判断一下当前level的节点是不是都为折叠、展开状态
        for (var i = 0;i < treeNodes.length; i++) {
            if(treeNodes[i].level >= maxLevel){	// 获取状态树的深度
                maxLevel = treeNodes[i].level;
            }
            if(treeNodes[i].level == level && treeNodes[i].isParent){
                if (type == "expand" && !treeNodes[i].open) {
                    flag=false;
                    break;
                } else if (type == "collapse" && treeNodes[i].open) {
                    flag=false;
                    break;
                }
            }
        }
        if(flag){
            //说明当前level的节点都为折叠或者展开状态
            if(type == "expand"){
                if(level < maxLevel-1){
                    level++;
                }
            }else if(type == "collapse"){
                if(level == 0){
                    return level;
                }
                level--;
            }
        }
        for (var i = 0;i < treeNodes.length; i++) {
            if(treeNodes[i].level == level && treeNodes[i].isParent){
                if (type == "expand" && !treeNodes[i].open) {
                    zTree.expandNode(treeNodes[i], true, false, null, true);
                } else if (type == "collapse" && treeNodes[i].open) {
                    zTree.expandNode(treeNodes[i], false, false, null, true);
                }
            }
        }
        return level;
    }

    // 展开全部节点，并返回当前展开层数 即最大层数
    this.expandAll = function(treeId) {
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        //全部打开
        treeObj.expandAll(true);
        // 设置当前打开的层数
        var treeNodes = treeObj.transformToArray(treeObj.getNodes());
        for(var i = 0 ; i<treeNodes.length;i++){
            if(treeNodes[i].level >= maxLevel){
                maxLevel = treeNodes[i].level;
            }
        }
        return maxLevel;
    }

    /**
     * 创建子分项工程
     * /childItemizedService/createChildItemized
     */
    this.createChildItemized = function (param) {
        var delay = $q.defer();
        param = JSON.stringify(param);
        var url_join = url + 'childItemizedService/createChildItemized';
        $http.post(url_join, param, {transformRequest: angular.identity}).then(function (data) {
            delay.resolve(data.data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };


});