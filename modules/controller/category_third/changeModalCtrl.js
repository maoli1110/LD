


//发起变更数据id
var addChange=[
    'ChangeEngineeringName',
    'ChangeOfNumber',
    'changestake1',
    'changestake2',
    'changestake3',
    'changestake4',
    'changeAssociated',
    'changeDescription'
]
//发起变更数据获取
function getchangeInfo() {
    var sendContent = {};
    for (var i = 0, len = addChange.length; i < len; i++) {
        var key = addChange[i];
        var $input = $("#" + key);
        if ($input.length != 0) {
            sendContent[key] = $input.val();
        }
    }
    return sendContent;
}

// 验证发起变更信息
function checkchangeInfo() {
    var sendContent = getchangeInfo();
    var requireKeyId = [
        'ChangeEngineeringName',
        'ChangeOfNumber',
        'changestake1',
        'changestake2',
        'changestake3',
        'changestake4',
        'changeAssociated',
        'changeDescription'
    ];

    for (var i = 0; i < requireKeyId.length; i++) {
        if ($('#' + requireKeyId[i]).hasClass("ng-invalid-required")) {
            layer.alert('请填写必要的变更信息', {
                closeBtn: 0,
                move: false
            });
            return false;
        }
        if ($('#' + requireKeyId[i]).hasClass("ng-invalid-maxlength")) {
            layer.alert('变更信息格式有误', {
                closeBtn: 0,
                move: false
            });
            return false;
        }
    }
    return true;
}
// 发起变更交互
angular.module('core').controller('CreateChangeModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService, FileUploader) {
        $scope.deptId = deptId;
        $scope.ok = function () {
        	
        if (!checkchangeInfo()) return;
            var sendContent = getchangeInfo();
            // sendContent["deptId"] = $scope.deptId;
            // sendContent["contractFiles"] = docList;
            // commonService.createConstruction(sendContent).then(function () {
            //     layer.alert('新建成功', {
            //         closeBtn: 0,
            //         move: false
            //     });
            // });
            console.log(sendContent);
            $uibModalInstance.close(sendContent);
        };


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.delBuild=function(delBuildVlu){
                $scope.delBuildVlu="";
        }
    }
]);

// 签发变更令
angular.module('core').controller('CreateChangeStakeModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService, FileUploader) {
        $scope.deptId = deptId;
        $scope.ok = function () {
        	alert("签发变更令")
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
//点此新建
        $scope.modalCreatChangeNew=function(){
            $("#modal-comp-group1").css("display","block");
        }
        $scope.modalCreatChangeList=function(){
            $("#modal-comp-group2").css("display","block");
        }
        $scope.undo=function(){
            $("#modal-comp-group1").css("display","none");
        }
        $scope.undo1=function(){
            $("#modal-comp-group2").css("display","none");
        }
        $scope.oknew=function(){
            alert("点此新建")
        }
    }
]);

// 添加表单
angular.module('core').controller('CreateChangeFormModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService, FileUploader) {
        
        $scope.listName=items.listName
        console.log($scope.listName)
        $scope.ok = function () {
        	console.log(checkId);
            $uibModalInstance.close(checkId);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        var checkId=[]
        $scope.dbCheck=function(id){
            if(checkId.indexOf(id) == "-1"){
                checkId.push(id); 
                $scope.checkId=checkId;
                $("#checkNum").html(checkId.length)
            }else{
                layer.alert('已经添加', {
                closeBtn: 0,
                move: false
                });
            }
        }
        $scope.delCheckId = function (id) {
            checkId.splice($.inArray(id,checkId),1);
            $("#checkNum").html(checkId.length)
        }
        
     
    }
]);

// 添加表单预览
angular.module('core').controller('CreateChangeFormSeeModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService, FileUploader) {
        $scope.deptId = deptId;
        $scope.ok = function () {
        	alert("添加表单预览")
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

// 点此新建
angular.module('core').controller('CreateChangeNewModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService, FileUploader) {
        $scope.deptId = deptId;
        $scope.ok = function () {
            alert("点此新建")
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

// 选择清单
angular.module('core').controller('CreateChangeListModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService, FileUploader) {
        $scope.deptId = deptId;
        $scope.ok = function () {
            alert("选择清单")
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);


//点击状态弹出流程
angular.module('core').controller('CreateChangeStatusModalPreview', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService, FileUploader) {
        $scope.deptId = deptId;
        $scope.ok = function () {
            alert("流程图")
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);


//提交
angular.module('core').controller('CreateChangeSubmitPreview', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService, FileUploader) {
        $scope.deptId = deptId;
        $scope.ok = function () {
            alert("提交")
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);



//审批
angular.module('core').controller('CreateChangeAuditPreview', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService, FileUploader) {
        $scope.deptId = deptId;
        $scope.ok = function () {
            alert("审批")
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);



//删除
angular.module('core').controller('CreateChangeDeletePreview', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService, FileUploader) {
        $scope.deptId = deptId;
        $scope.ok = function () {
            alert("删除成功")
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

