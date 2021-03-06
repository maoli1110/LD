'use strict';
/*1、工程划分的树：【工程管理】模块下“工程划分”、“清单管理”，【质检评定】下“开工报告”、“检验评定”，【计量支付】下“中间计量”-“合同”
 2、合同树：【工程管理】合同管理
 3、变更的树：【变更管理】，【计量支付】下“中间计量”-“变更”
 4、计量的树：【计量支付】下“计量支付”*/
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/ld/contractManage');
		//路由按左侧树结构划分(第一类，第二类)
		$stateProvider.
		 state('login', {
			url:'/login',
			templateUrl: 'template/core/login.html',
			data: {
				displayName: 'login'
			}
		}).state('ld',{
			url:'/ld',//第二类
			templateUrl:'template/category_second/ld.html',
			controller:'ldCtrl',
			displayName:{
				displayName:"ld"
			}
		}).state('ld.contractManage',{
			url:'/contractManage',//第一类类-工程管理-合同管理
			controller:'firstCtrl',
			templateUrl: 'template/category_first/contract_manage.html',
			data: {
				displayName: 'contractManage'
			}
		}).state('ld.projectDivisionContract',{
			url:'/projectDivisionContract',//第二类-工程管理-工程划分-合同
			controller:'projectDivisionContractCtrl',
			templateUrl:'template/category_second/project_division_contract.html',
			displayName:{
				displayName:"projectDivisionContract"
			}
		}).state('ld.projectDivisionStake',{
			url:'/projectDivisionStake',//第二类-工程管理-工程划分-桩号
			controller:'projectDivisionStakeCtrl',
			templateUrl:'template/category_second/project_division_stake.html',
			displayName:{
				displayName:"projectDivisionStake"
			}
		}).state('ld.listManageContract',{
			url:'/listManageContract',//第二类-清单管理-合同
			controller:'listManageContractCtrl',
			templateUrl:'template/category_second/list_manage_contract.html',
			displayName:{
				displayName:"listManageContract"
			}
		}).state('ld.listManageItemized',{
			url:'/listManageItemized',//第二类-清单管理-桩号
			controller:'listManageItemizedCtrl',
			templateUrl:'template/category_second/list_manage_itemized.html',
			displayName:{
				displayName:"listManageItemized"
			}
		}).state('ld.projectChange',{
			url:'/projectChange',//第三类-工程变更-合同
			controller:'projectChangeCtrl',
			templateUrl:'template/category_third/project_change.html',
			displayName:{
				displayName:"projectChange"
			}
		}).state('ld.projectChangeStake',{
			url:'/projectChangeStake/?:changeFarterId',//第三类-工程变更-桩号
			controller:'projectChangeStakeCtrl',
			templateUrl:'template/category_third/project_change_stake.html',
			displayName:{
				displayName:"projectChangeStake"
			}
		})
	}
]);