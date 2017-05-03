'use strict';
/**
 * component
 * 工程管理-工程划分-合同页面js
 */
angular.module('core').controller('projectDivisionContractCtrl', ['$scope', '$http','$uibModal','commonService','$timeout','$compile','$state',
    function ($scope, $http,$uibModal,commonService,$timeout,$compile,$state) {
	    
	    $scope.$on('call',function(event,data){
	    	// debugger
	       	$scope.name = data;
	       	$state.go('second.projectDivisionStake')
       })


    }]);