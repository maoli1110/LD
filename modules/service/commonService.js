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
    //获取项目部下合同段
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
    /**
     * 获取工程划分-合同段页面展示数据，对应到后端在子分项工程下
     * @param pageParam {pageSize: 15,pageNumber: 1,queryParam: "00",sortField: "id",sortType: "desc"}
     * @param sectionContractId 合同段id
     * @returns {"totalCount": 1,"pageSize": 15,"pageNumber": 1,"totalPage": 1,
                "resultList": [{"id": 8,"unitProjectName": "单位工程节点01","deptProjectName": "分部工程001",
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
                delay.resolve(data);
            },
            error: function (error) {
                delay.reject(JSON.parse(error.responseText));
            }
        });
        return delay.promise;
    };

    /**
     * 点击施工合同左侧展示树
     */
    this.getConstructConstractTree = function (constructConstractId) {
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
});