'use strict';
/**
 * component
 */
angular.module('core').controller('firstCtrl', ['$scope', '$http', '$uibModal', 'commonService', '$timeout', '$compile',
    function ($scope, $http, $uibModal, commonService, $timeout, $compile) {
        // 菜单切换，右侧数据对应地改变
        // switchDropdown();
        // function switchDropdown() {
        //     var txt=$('.menu-name').text();
        // alert(1)
        //     switch (txt){
        //         case '施工合同':
        //             alert(1)
        //
        //             $scope.construct=$('.menu-name').text();
        //             break;
        //         case '监理合同':
        //             alert(1)
        //
        //             $scope.supervise=$('.menu-name').text();
        //             break;
        //         case '监理试验室合同':
        //             alert(1)
        //
        //             $scope.lab=$('.menu-name').text();
        //             break;
        //     }

        // }

        // 表单验证
        $scope.submitForm = function(isValid) {
            if (isValid) {
                alert('success');
            }
        };
    }]);