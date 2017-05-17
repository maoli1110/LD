/**
 * Created by kylee on 2017/5/8.
 */
angular.module('core').controller('unitModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {
        /*
         * 创建单位、子单位、分部、子分部、分项工程
         * $scope.unitNameArr单位工程名称集合,$scope.partNameArr分部工程名称集合,$scope.itemNameArr分项工程名称集合
         * items包含当前选中节点的id,parentId,nodeType,当前用户创建的createNodeType
         * */
        //获取工程名称数组
        $scope.unitNameArr = staticData.defaultNodeName.unitNameArr;
        $scope.partNameArr = staticData.defaultNodeName.partNameArr;
        $scope.itemNameArr = staticData.defaultNodeName.itemNameArr;
        $scope.selectedNodeInfo = items;
        //当前选择节点的名称
        $scope.currentNodeName = $scope.selectedNodeInfo.currentNodeName;
        //关闭摸态框需要传出的创建tree节点所需参数
        $scope.createTreeNodeInfoInfo = {
            nodeName:null,
            nodeNum:null,
            nodeType:items.createNodeType,
            parentId:null,
            contractId:items.currentContractId
        };
        //根据创建的节点类型判断当前页面nodeName显示
        switch ($scope.selectedNodeInfo.createNodeType) {
            case 0 :
            $scope.createTreeNodeInfo.nodeName = $scope.unitNameArr[0];
            break
            case 2 :
            $scope.createTreeNodeInfo.nodeName = $scope.partNameArr[0];
            break;
            case 4 :
            $scope.createTreeNodeInfo.nodeName = $scope.itemNameArr[0];
            break;
            // case 1 :
            // case 3 :
            // case 5 :
            // $scope.createTreeNodeInfo.nodeName = items.currentNodeName;
            // break;
        }

        //如果当前选中节点nodetype与用户当前需要创建的createNodeType相同则是创建同级，不同则是创建子级
        $scope.createTreeNodeInfo.parentId = ($scope.selectedNodeInfo.nodeType === $scope.createTreeNodeInfo.nodeType)?$scope.selectedNodeInfo.parentId:$scope.selectedNodeInfo.id;
        
        //生成bootstrap-select样式
        $timeout(function(){
            $('.selectpicker').selectpicker({
                style: 'btn-primary',
                size: 'auto'
            });
        })
        

        $scope.ok = function () {
            $uibModalInstance.close($scope.createTreeNodeInfo);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
angular.module('core').controller('subItemModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService) {
        /*
         * 创建子分项工程
         * */
        //获取工程名称数组
        $scope.itemNameArr = staticData.defaultNodeName.itemNameArr;
        $scope.selectedNodeInfo = items;
        //当前选择节点的名称
        $scope.currentNodeName = $scope.selectedNodeInfo.currentNodeName;
       
        //关闭摸态框需要传出的创建tree节点所需参数
        $scope.tempDate = {
            sec1:'',
            sec2:'',
            sec3:'',
            sec4:''
        }
        $scope.createTreeNodeInfo = {
            nodeName:'string',
            nodeNum:'string',
            nodeType:items.createNodeType,
            parentId:null,
            contractId:items.currentContractId
        };
        $scope.createChildItemizedInfo = {
            treeNodeId: 0,
            sectionContractId: 0,
            unitProjectName: '',
            deptProjectName: '',
            childItemizedName: '',
            stakeMark: '',
            childItemizedNum: '',
            contractPictureNum: '',
            compGroupId: ''
        }
        //如果当前选中节点nodetype与用户当前需要创建的createNodeType相同则是创建同级，不同则是创建子级
        $scope.createTreeNodeInfo.parentId = ($scope.selectedNodeInfo.nodeType === $scope.createTreeNodeInfo.nodeType)?$scope.selectedNodeInfo.parentId:$scope.selectedNodeInfo.id;
        //生成bootstrap-select样式
        $timeout(function(){
            $('.selectpicker').selectpicker({
                style: 'btn-primary',
                size: 'auto'
            });
        });
        
        $scope.ok = function () {
            $scope.createTreeNodeInfo.nodeName = $scope.createChildItemizedInfo.childItemizedName;
            $scope.createTreeNodeInfo.nodeNum = $scope.createChildItemizedInfo.childItemizedNum;
            commonService.createTreeNode($scope.createTreeNodeInfo).then(function(data){
                $scope.createChildItemizedInfo.treeNodeId = data.data;
                $scope.createChildItemizedInfo.stakeMark = $scope.tempData.sec1+"+"+$scope.tempData.sec2+"~"+$scope.tempData.sec3+"+"+$scope.tempData.sec4;
                $uibModalInstance.close($scope.createChildItemizedInfo);
            });
           
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
