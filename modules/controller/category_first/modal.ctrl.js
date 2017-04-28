/**
 * Created by caoxx on 2017/4/28.
 */
angular.module('core').controller('ModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {
        /*
         * 构件库数据展示
         * */
        $scope.items = items;
        $scope.selected = {
            item: $scope.items
        };

        $scope.ok = function () {
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
])