'use strict';

var ApplicationConfiguration = (function(){
	// 应用程序名和依赖
	var applicationModuleName = 'appname';
	var applicationModuleVendorDependencies = ['ui.router','ui.bootstrap','angularFileUpload'];

	// 添加新模块
	var registerModule = function(moduleName, dependencies) {
		angular.module(moduleName, dependencies || []);
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	var urls = {
        apiUrl: ''
    };

    

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule,
		urls:urls
	};

})();

var staticData = (function(){

	var defaultNodeName = {
    	unitNameArr:null,
    	partNameArr:null,
    	itemNameArr:null
    };

	return {
		defaultNodeName: defaultNodeName
	};

})();