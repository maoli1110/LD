'use strict';
/**
 * component
 */
angular.module('core').controller('secondCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile) {
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
            }
        };

        //获取左侧树
        commonService.getzTreeData().then(function(data){
            console.log('getzTreeData');
            console.log(data,'getzTreeData');
            var treeObj = $.fn.zTree.init($(".ztree"), setting, data.data);
        });
        //获取项目部
        commonService.getDept().then(function(data){
            console.log('getDept')
            console.log(data,'getDept');
        })
        //获取项目部下合同段
        commonService.getcontract().then(function(data){
            console.log('getcontract')
            console.log(data,'getcontract');
        })
       

    }]);