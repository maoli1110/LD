/**
 * Created by kylee on 2017/5/8.
 */
angular.module('core').controller('unitModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {
        /*
         * 创建单位工程
         * 
         * */

        //item包含当前选中节点的id,parentId,nodeType,当前用户创建的createNodeType
        $scope.selectedNodeInfo = items;
        $scope.data = {
            nodeName:null,
            nodeNum:null,
            nodeType:items.createNodeType,
            parentId:null,
            contractId:items.currentContractId
        };
        //如果当前选中节点nodetype与用户当前需要创建的createNodeType相同则是创建同级，不同则是创建子级
        $scope.data.parentId = ($scope.selectedNodeInfo.nodeType === $scope.data.nodeType)?$scope.selectedNodeInfo.parentId:$scope.selectedNodeInfo.id;
        
        $scope.ok = function () {
            $uibModalInstance.close($scope.data);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
angular.module('core').controller('subunitModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {
        /*
         * 创建子单位工程
         * */
        $scope.items = items;
        $scope.selected = {
            item: $scope.items
        };

        $scope.ok = function () {
            var $select = $(".selectProject");
            $select.remove();
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
angular.module('core').controller('partModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {
        /*
         * 创建分部工程
         * */
        $scope.items = items;
        $scope.selected = {
            item: $scope.items
        };

        $scope.ok = function () {
            var $select = $(".selectProject");
            $select.remove();
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
angular.module('core').controller('subpartModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {
        /*
         * 创建子分部工程
         * */
        $scope.items = items;
        $scope.selected = {
            item: $scope.items
        };

        $scope.ok = function () {
            var $select = $(".selectProject");
            $select.remove();
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
angular.module('core').controller('itemModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {
        /*
         * 创建分项工程
         * */
        $scope.items = items;
        $scope.selected = {
            item: $scope.items
        };

        $scope.ok = function () {
            var $select = $(".selectProject");
            $select.remove();
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
angular.module('core').controller('subitemModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {
        /*
         * 创建子分项工程
         * */
        $scope.items = items;
        $scope.selected = {
            item: $scope.items
        };

        $scope.ok = function () {
            var $select = $(".selectProject");
            $select.remove();
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);