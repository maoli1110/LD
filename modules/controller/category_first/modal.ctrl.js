/**
 * Created by caoxx on 2017/4/28.
 */
// 施工合同
var constructConstractKeys = [
    "contractNum",
    "sectionNum",
    "contractAmount",
    "projectName",
    "signedDate",
    "constructionUnit",
    "supervisionUnit",
    "executionUnit",
    "supervisingEngineer",
    "constructionManager",
    "projectChief",
    "startStakeMark",
    "endStakeMark",
    "sectionLength",
    "planStartDate",
    "planEndDate",
    "actualStartDate",
    "actualEndDate",
    "duration",
    "ppid"
    // contractFiles

];
// 监理合同
var constructSupervisionKeys = [
    "contractNum",
    "sectionNum",
    "contractAmount",
    "projectName",
    "signedDate",
    "constructionUnit",
    "supervisionUnit",
    "supervisingEngineer"
    // contractFiles
];
// 监理试验室合同
var constructSupervisionLabKeys = [
    "contractNum",
    "sectionNum",
    "contractAmount",
    "projectName",
    "signedDate",
    "constructionUnit",
    "supervisionUnit",
    "supervisingEngineer",
    "supervisionLaboratoryUnit"
    // contractFiles
];

// 日期统一后台转为毫秒
function formatDate(date) {
    return new Date(date).getTime();
}
// 获取施工合同信息
function getConstructConstractInfo() {
    var sendContent = {};
    for (var i = 0, len = constructConstractKeys.length; i < len; i++) {
        var key = constructConstractKeys[i];
        var $input = $("#" + key);
        if ($input.length != 0) {
            sendContent[key] = $input.val();
        }
    }
    sendContent["signedDate"] = formatDate(sendContent["signedDate"]);
    sendContent["planStartDate"] = formatDate(sendContent["planStartDate"]);
    sendContent["planEndDate"] = formatDate(sendContent["planEndDate"]);
    sendContent["actualStartDate"] = formatDate(sendContent["actualStartDate"]);
    sendContent["actualEndDate"] = formatDate(sendContent["actualEndDate"]);
    sendContent["ppid"] = 1111;
    // ！！！！！！！！！！！！！！！！！此处要修改
    sendContent["contractFiles"] = [];

    return sendContent;
}
// 验证施工合同信息
function checkConstructConstractValidity() {
    var sendContent = getConstructConstractInfo();
    var requireKeyId = [
        "contractNum",
        "sectionNum",
        "contractAmount",
        "projectName",
        "signedDate",
        "constructionUnit",
        "supervisionUnit",
        "executionUnit",
        "startStakeMark",
        "endStakeMark",
        "sectionLength",
        "planStartDate",
        "planEndDate",
        "actualStartDate",
        "actualEndDate",
        "duration"
        // "ppid"
    ];

    for (var i = 0; i < requireKeyId.length; i++) {
        if (!$('#' + requireKeyId[i]).val()) {
            alert("请填写必要的合同信息！");
            return false;
        }
    }

    if (sendContent["planStartDate"] > sendContent["planEndDate"] || sendContent["actualStartDate"] > sendContent["actualEndDate"]) {
        alert('起始时间不能大于结束时间');
        return false;
    }

    return true;
}
// 获取监理合同信息
function getSupervisionConstractInfo() {
    var sendContent = {};
    for (var i = 0, len = constructSupervisionKeys.length; i < len; i++) {
        var key = constructSupervisionKeys[i];
        var $input = $("#" + key);
        if ($input.length != 0) {
            sendContent[key] = $input.val();
        }
    }
    sendContent["signedDate"] = formatDate(sendContent["signedDate"]);
    // ！！！！！！！！！！！！！！！！！此处要修改
    sendContent["contractFiles"] = [];

    return sendContent;
}
// 验证监理合同信息
function checkSupervisionConstractValidity() {
    var sendContent = getSupervisionConstractInfo();
    var requireKeyId = [
        "contractNum",
        "sectionNum",
        "contractAmount",
        "projectName",
        "signedDate",
        "constructionUnit",
        "supervisionUnit"
    ];

    for (var i = 0; i < requireKeyId.length; i++) {
        if (!$('#' + requireKeyId[i]).val()) {
            alert("请填写必要的合同信息！");
            return false;
        }
    }
    return true;
}
// 获取监理试验室合同信息
function getSupervisionLabConstractInfo() {
    var sendContent = {};
    for (var i = 0, len = constructSupervisionLabKeys.length; i < len; i++) {
        var key = constructSupervisionLabKeys[i];
        var $input = $("#" + key);
        if ($input.length != 0) {
            sendContent[key] = $input.val();
        }
    }
    sendContent["signedDate"] = formatDate(sendContent["signedDate"]);
    // ！！！！！！！！！！！！！！！！！此处要修改
    sendContent["contractFiles"] = [];

    return sendContent;
}
// 验证监理试验室合同信息
function checkSupervisionLabConstractValidity() {
    var sendContent = getSupervisionLabConstractInfo();
    var requireKeyId = [
        "contractNum",
        "sectionNum",
        "contractAmount",
        "projectName",
        "signedDate",
        "constructionUnit",
        "supervisionUnit",
        "supervisionLaboratoryUnit"
    ];

    for (var i = 0; i < requireKeyId.length; i++) {
        if (!$('#' + requireKeyId[i]).val()) {
            alert("请填写必要的合同信息！");
            return false;
        }
    }
    return true;
}
// 新建施工合同
angular.module('core').controller('CreateConstractModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService','FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService,FileUploader) {
        $scope.deptId = deptId;
        $scope.ok = function () {
            if (!checkConstructConstractValidity()) return;
            var sendContent = getConstructConstractInfo();
            sendContent["deptId"] = $scope.deptId;
            commonService.createConstruction(sendContent);
            // console.log(sendContent);
            $uibModalInstance.close(sendContent);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
// 新建监理合同
angular.module('core').controller('CreateSupervisionModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService','FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService,FileUploader) {
        /*
         * 构件库数据展示
         * */
        $scope.deptId = deptId;
        $scope.ok = function () {
            if (!checkSupervisionConstractValidity()) return;
            var sendContent = getSupervisionConstractInfo();
            sendContent["deptId"] = $scope.deptId;
            commonService.createSupervision(sendContent);
            $('.contract-list').slideUp(300);
            $uibModalInstance.close(sendContent);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
// 新建监理试验室合同
angular.module('core').controller('CreateSupervisionLabModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService','FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService,FileUploader) {
        /*
         * 构件库数据展示
         * */
        $scope.deptId = deptId;
        console.log(deptId);
        $scope.ok = function () {
            if (!checkSupervisionLabConstractValidity()) return;
            var sendContent = getSupervisionLabConstractInfo();
            sendContent["deptId"] = $scope.deptId;
            commonService.createSupervisionLaboratory(sendContent);
            console.log(sendContent);
            $('.contract-list').slideUp(300);
            $uibModalInstance.close(sendContent);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
// 编辑施工合同
angular.module('core').controller('EditConstractModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService','FileUploader',
    function ($scope, $http, $uibModalInstance, $constructItems, $timeout, commonService,FileUploader) {
        $scope.constructConstractInfos = $constructItems.constructConstractInfos;
        $scope.deptId = $constructItems.deptId;
        $scope.id = $constructItems.id;
        $scope.ok = function () {
            if (!checkConstructConstractValidity()) return;
            var sendContent = getConstructConstractInfo();
            sendContent["deptId"] = $scope.deptId;
            sendContent["id"] = $scope.id;
            commonService.createConstruction(sendContent);
            $('.contract-list').slideUp(300);
            // console.log(sendContent);
            $uibModalInstance.close(sendContent);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
// 编辑监理合同
angular.module('core').controller('EditSupervisionModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService','FileUploader',
    function ($scope, $http, $uibModalInstance, $supervisionItems, $timeout, commonService,FileUploader) {

        $scope.deptId = $supervisionItems.deptId;
        $scope.id = $supervisionItems.id;
        $scope.supervisionConstractInfos = $supervisionItems.supervisionConstractInfos;
        console.log($supervisionItems);

        $scope.ok = function () {
            if (!checkSupervisionConstractValidity()) return;
            var sendContent = getSupervisionConstractInfo();
            sendContent["deptId"] = $scope.deptId;
            sendContent["id"] = $scope.id;
            commonService.createSupervision(sendContent);
            $uibModalInstance.close(sendContent);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
// 编辑监理试验室合同
angular.module('core').controller('EditSupervisionLabModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService','FileUploader',
    function ($scope, $http, $uibModalInstance, $labItems, $timeout, commonService,FileUploader) {
        /*
         * 构件库数据展示
         * */
        console.log($labItems);
        $scope.deptId = $labItems.deptId;
        $scope.id = $labItems.id;
        $scope.labConstractInfos = $labItems.labConstractInfos;
        $scope.ok = function () {
            if (!checkSupervisionLabConstractValidity()) return;
            var sendContent = getSupervisionLabConstractInfo();
            sendContent["deptId"] = $scope.deptId;
            sendContent["id"] = $scope.id;
            commonService.createSupervisionLaboratory(sendContent);
            console.log(sendContent);
            $uibModalInstance.close(sendContent);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
// 删除施工合同
angular.module('core').controller('deleteConstractModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService','FileUploader',
    function ($scope, $http, $uibModalInstance, id, $timeout, commonService,FileUploader) {

        $scope.id = id;
        $scope.ok = function () {
            var $select = $(".selectProject");
            $select.remove();
            commonService.deleteConstruction(id);
            $uibModalInstance.close($scope.id);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
// 删除监理合同
angular.module('core').controller('deleteSupervisionModal', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService','FileUploader',
    function ($scope, $http, $uibModalInstance, id, $timeout, commonService,FileUploader) {

        $scope.id = id;
        $scope.ok = function () {
            var $select = $(".selectProject");
            $select.remove();
            commonService.deleteSupervision(id);
            $uibModalInstance.close($scope.id);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
// 删除监理试验室合同
angular.module('core').controller('deleteSupervisionLabModal', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService','FileUploader',
    function ($scope, $http, $uibModalInstance, id, $timeout, commonService,FileUploader) {

        $scope.id = id;
        $scope.ok = function () {
            var $select = $(".selectProject");
            $select.remove();
            commonService.deleteSupervisionLaboratory(id);
            $uibModalInstance.close($scope.id);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
// 删除附件
angular.module('core').controller('deleteAttachmentModal', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService','FileUploader',
    function ($scope, $http, $uibModalInstance, id, $timeout, commonService,FileUploader) {

        // $scope.id = id;
        $scope.ok = function () {
            var $select = $(".selectProject");
            $select.remove();
            // commonService.deleteContractAttachment(id);
            $uibModalInstance.close($scope.id);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
// 预览合同
angular.module('core').controller('PreviewConstractModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService','FileUploader',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService,FileUploader) {

        // 删除附件
        $('.file-wrapper .file-item').on("click", function () {
            selectProject(this);
        });

        function selectProject(element) {
            $(".selectProject").removeClass("selectProject");
            $(element).addClass("selectProject");
        }

        // console.log($('#btn-delete'));
        $('#btn-delete').on('click', function () {
            var $select = $(".selectProject");
            if ($select.length == 0) {
                alert('请选择一个合同');
                return;
            }
            $(this).attr('ng-click', $scope.deleteAttachmentModal());

        });

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
