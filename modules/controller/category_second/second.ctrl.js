'use strict';
/**
 * component
 */
angular.module('core').controller('secondCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile) {
        //获取左侧树
        commonService.getzTreeData().then(function(data){
            console.log('getzTreeData');
            console.log(data,'getzTreeData');
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