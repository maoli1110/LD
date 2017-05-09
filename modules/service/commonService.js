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
        // param = {
        //   nodeNum: "TREE002",
        //   nodeName: "子单位工程",
        //   nodeType: -1,
        //   parentId: 1
        // }
        param = JSON.stringify(param);
        var delay = $q.defer();
        $.ajax({
            type: "POST",
            url: url + 'common/projectTreeService/createProjectTreeNode',
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
    }

    /**
     * 树节点排序
     * @param {string} nodeNum  节点编码
     * @param {string} nodeName 节点名称
     * @return {type} [description]
     */
    this.sortNodes = function () {
        param = []
        param = JSON.stringify(param);
        var delay = $q.defer();
        $.ajax({
            type: "POST",
            url: url + 'common/projectTreeService/sortNodes',
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
    }
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
        }
        param = JSON.stringify(param);
        var delay = $q.defer();
        $.ajax({
            type: "POST",
            url: url + 'common/projectTreeService/updateChildProjectName',
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
    }

    /**
     * 获取子节点
     * @param  {string} id 当前节点的id(没有任何树节点的情况下 id为合同段)
     * @return {string} nodetype节点类型(根据合同段获取单位工程时nodetype=-1,其它都是节点类型)
     * 备注:nodetype（0单位，1子单位，2分项，3子分项，4分部，5子分部）
     */
    this.getTreeNode = function (param) {
        var delay = $q.defer();
        var url_join = url + "common/projectTreeService/"+param.id +"/"+param.nodeType;
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
        var url_join = url+"orgnization/getDeptInfos";
        var test_join = './json/dept.json';
        $http.post(url_join).then(function(data){
            delay.resolve(data.data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    //获取项目部下施工合同段
    this.getContractList = function(deptId){
        var delay = $q.defer();
        var url_join = url+"contracts/construction?deptId="+deptId;
        var test_join = './json/contractList.json';
        $http.get(url_join,{'withCredentials':true}).then(function(data){
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    //获取项目部下监理合同段
    this.getSupervisionList = function(deptId){
        var delay = $q.defer();
        var url_join = url+"contracts/supervision?deptId="+deptId;
        $http.get(url_join,{'withCredentials':true}).then(function(data){
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    //获取项目部下监理试验室合同段
    this.getSupervisionLaboratoryList = function(deptId){
        var delay = $q.defer();
        var url_join = url+"contracts/supervisionLaboratory?deptId="+deptId;
        $http.get(url_join,{'withCredentials':true}).then(function(data){
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
        var url_join = url+"contracts/construction?deptId="+deptId;
        var test_join = './json/contractList.json';
        $http.get(url_join,{'withCredentials':true}).then(function(data){
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
        pageParam = JSON.stringify(pageParam);
        var delay = $q.defer();
        $.ajax({
            type: "POST",
            url: url + 'common/childItemizedService/findChildItemizedInfos/' + sectionContractId,
            contentType: 'application/json;',
            data: pageParam,
            success: function (data) {
                // 后台返回的当前页码是从0开始，此处先加1
                ++data.number;
                delay.resolve(data);
            },
            error: function (error) {
                delay.reject(JSON.parse(error.responseText));
            }
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
        var url_join = url+"common/childItemizedService/findChildItemizedDetail/" + treeNodeId;
        $http.get(url_join,{'withCredentials':true}).then(function(data){
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
        var url_join = url+"common/childItemizedService/updateContractPictureNum/" + childItemId +'/'+contractPictureNum;
        $http.get(url_join,{'withCredentials':true}).then(function(data){
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
        var url_join = url+"common/childItemizedService/findCompGroupsByPpid/" + ppid;
        $http.get(url_join,{'withCredentials':true}).then(function(data){
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
        var url_join = url+"common/childItemizedService/updateCompGroupId/" + childItemId + "/" + compGroupId;
        $http.get(url_join,{'withCredentials':true}).then(function(data){
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    /**
     * 获取施工合同展示数据
     */
    this.getConstructConstractInfos = function (constructConstractId) {
        var delay = $q.defer();
        $.ajax({
            type: "GET",
            url: url + 'contracts/construction/' + constructConstractId,
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

    /**
     *     获取监理合同展示数据
     */
    this.getSupervisionConstractInfos = function (supervisionConstractId) {
        var delay = $q.defer();
        $.ajax({
            type: "GET",
            url: url + 'contracts/supervision/' + supervisionConstractId,
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

    /**
     *     获取监理试验室合同展示数据
     */
    this.getLabConstractInfos = function (labConstractId) {
        var delay = $q.defer();
        $.ajax({
            type: "GET",
            url: url + 'contracts/supervisionLaboratory/' + labConstractId,
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
    this.createConstruction = function(sendConstructContent){
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
    this.createSupervision = function(sendSupervisionContent){
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
    this.createSupervisionLaboratory = function(sendSupervisionLabContent){
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
    this.deleteConstruction= function(id){
        var delay = $q.defer();
        var url_join = url+"contracts/construction/delete/"+id;
        $http.get(url_join,{'withCredentials':true}).then(function(data){
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    // 删除监理合同
    // /contracts/supervision/delete/{id}
    this.deleteSupervision = function(id){
        var delay = $q.defer();
        var url_join = url+"contracts/supervision/delete/"+id;
        $http.get(url_join,{'withCredentials':true}).then(function(data){
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };
    // 删除监理试验室合同
    // /contracts/supervisionLaboratory/delete/{id}
    this.deleteSupervisionLaboratory = function(id){
        var delay = $q.defer();
        var url_join = url+"contracts/supervisionLaboratory/delete/"+id;
        $http.get(url_join,{'withCredentials':true}).then(function(data){
            delay.resolve(data);
        }, function (error) {
            delay.reject(error);
        });
        return delay.promise;
    };

    // 删除合同附件post
    // /contracts/files/{id}
    this.deleteContractAttachment=function (id) {
        var delay = $q.defer();
        $.ajax({
            type: "POST",
            url: url + 'contracts/files/'+id,
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
});