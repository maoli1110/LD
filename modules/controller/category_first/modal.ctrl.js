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
angular.module('core').controller('CreateConstractModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService, FileUploader) {
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
angular.module('core').controller('CreateSupervisionModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService, FileUploader) {

        $scope.deptId = deptId;
        $scope.ok = function () {
            // var docList = [];
            // $.each($scope.docsUploadList,function (index, value) {
            //     var current = {};
            //     current.id = index;
            //     current.fileName = value.name;
            //     current.fileSize = value.size;
            //     current.fileMD5 = 2222222;
            //     current.fileUUID = 1;
            //     docList.push(current);
            // })
            // console.log(docList);
            // console.log($scope.docsUploadList);

            //上传成功之后调用更新对UI
            function updateUploadList(response, uploaderSource) {
                if (response[0].type != "error") {
                    var unit = {};
                    unit.name = response[0].result.fileName;
                    unit.md5 = response[0].result.fileMd5;
                    unit.size = response[0].result.fileSize;
                    unit.uuid = response[0].result.uuid;
                    // unit.sourceType = 3;
                    $scope.uploadDocList.push(unit);
                } else {	// 提交失败 弹框提示
                    layer.open({
                        type: 1,
                        title: false,
                        closeBtn: 0,
                        shadeClose: true,
                        skin: 'yourclass',
                        move: false,
                        content: '<div class="tips">' + response[0].info + '</div><div class="tips_ok" onclick="layer.closeAll();">好</div>'
                    });
                    return;
                }
            }

            $scope.uploader.onErrorItem = function (item, response, status, headers) {
                layer.closeAll();
                $timeout(function () {
                    if (!$scope.uploadErrorSignal) {
                        layer.alert("网络错误，上传失败，请重新上传！", {
                            title: '提示',
                            closeBtn: 0,
                            move: false
                        });

                        $scope.uploader.cancelAll();
                        $scope.uploader.clearQueue();
                        $scope.uploadErrorSignal = true;
                    }
                }, 1000)
            }

            if ($scope.uploader.queue.length) {
                $scope.uploader.uploadAll();
                //每个上传成功之后的回调函数
                $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    //console.info('onSuccessItem', fileItem, response, status, headers);
                    updateUploadList(response, 'uploader');
                };
                //全部成功的回调函数
                $scope.uploader.onCompleteAll = function () {
                    $scope.onCompleteAllSignal = true;
                };
            }

            if (! $scope.uploader.queue.length) {
                saveCooperation();
                return;
            }else {
                //轮询是否上传成功
                var checkUploadInterval = setInterval(function () {
                    if ( $scope.onCompleteAllSignal == true &&  $scope.uploadErrorSignal == false) {

                        clearUploadInterval();
                        layer.alert('onCompleteAllSignal', $scope.onCompleteAllSignal);
                        saveCooperation();
                    } else if ( $scope.uploadErrorSignal == true) {
                        clearUploadInterval();
                        $scope.uploadErrorSignal = false;
                    }
                }, 100);
            }

            //清除轮询
            function clearUploadInterval() {
                clearInterval(checkUploadInterval);
            }


            function saveCooperation() {
                //拼接资料数组
                var docSelectedList1 = [];
                angular.forEach($scope.docsUploadList, function (value, key) {
                    var a = {};
                    // if(backJson){
                    //     var modifys = [];
                    //     angular.forEach(backJson,function(value1, key1){
                    //         if(!value1){
                    //             return;
                    //         }
                    //         if(key1 == value.uuid){
                    //             var i = 0;
                    //             for(i = 0; i < value1.PdfModify.length; i++)
                    //             {
                    //                 modifys.push(value1.PdfModify[i]);
                    //             }
                    //         }
                    //     });
                    // }
                    // a.modifys = modifys;
                    a.md5 = value.filemd5;
                    a.name = value.docName;
                    a.needSign = false;
                    a.uuid = value.uuid;
                    a.size = value.filesize;
                    // a.sourceType = scope.beSourceType;
                    docSelectedList1.push(a);
                });

            }

            if (!checkSupervisionConstractValidity()) return;
            var sendContent = getSupervisionConstractInfo();
            sendContent["deptId"] = $scope.deptId;
            sendContent["contractFiles"] = docList;
            console.log(sendContent);
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
angular.module('core').controller('CreateSupervisionLabModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService, FileUploader) {
        /*
         * 构件库数据展示
         * */
        $scope.deptId = deptId;
        // console.log(deptId);
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
angular.module('core').controller('EditConstractModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, $constructItems, $timeout, commonService, FileUploader) {
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
angular.module('core').controller('EditSupervisionModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, $supervisionItems, $timeout, commonService, FileUploader) {

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
angular.module('core').controller('EditSupervisionLabModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, $labItems, $timeout, commonService, FileUploader) {
        /*
         * 构件库数据展示
         * */
        console.log($labItems);
        $scope.deptId = $labItems.deptId;
        $scope.id = $labItems.id;
        $scope.labConstractInfos = $labItems.labConstractInfos;
        $scope.ok = function () {

            var docList = [];
            $.each($scope.docsUploadList,function (index, value) {
                var current = {};
                current.id = index;
                current.fileName = value.name;
                current.fileSize = value.size;
                current.fileMD5 = 2222222;
                current.sectionContractId  = $scope.id;
                current.fileUUID = 1;
                docList.push(current);
            })
            console.log(docList);
            console.log($scope.docsUploadList);

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
angular.module('core').controller('deleteConstractModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, id, $timeout, commonService, FileUploader) {

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
angular.module('core').controller('deleteSupervisionModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, id, $timeout, commonService, FileUploader) {

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
angular.module('core').controller('deleteSupervisionLabModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, id, $timeout, commonService, FileUploader) {

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
angular.module('core').controller('deleteAttachmentModal', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, id, $timeout, commonService, FileUploader) {

        // $scope.id = id;
        $scope.ok = function () {
            // if(){
            //
            // }else {
            //
            // }
            var $select = $(".deleteSelect");
            $select.parent().parent().remove();
            // commonService.deleteContractAttachment(id);
            $uibModalInstance.close($scope.id);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
angular.module('core').controller('editCompGroupCtrl', ['$scope', '$http', '$uibModalInstance', 'compGroupInfos', '$timeout', 'commonService',
    function ($scope, $http, $uibModalInstance, compGroupInfos, $timeout, commonService) {
        $scope.allCompGroupInfos = compGroupInfos;
        $scope.compGroupInfos = compGroupInfos;
        $scope.selected = {
            compGroupId: $scope.compGroupInfos[0].compGroupId
        };
        // 默认选中第一个
        var oldSelectedCompGroupId = $scope.compGroupInfos[0].compGroupId;
        var first = true;
        /**
         * 点击构件组时改变背景色
         * @param ele 点击的构件组id
         */
        $scope.clickCompGroup = function (ele) {
            if(first) { // 第一次点击 不用比较 直接设置背景色
                $("#"+ele).css('background-color','#eef1f8');
                first = false;
                oldSelectedCompGroupId = ele;
                return;
            }
            if(oldSelectedCompGroupId == ele) {
                return;
            } else {    // 先把之前设置的背景色去掉 再设置新选中的背景色
                $("#"+oldSelectedCompGroupId).css('background-color','#fff');
                $("#"+ele).css('background-color','#eef1f8');
                oldSelectedCompGroupId = ele;
            }
        };

        /**
         * 筛选构件组
         */
        $scope.searchCompGroup = function () {
            var searchKey = $(".input-search").val();
            if('' === searchKey) {
                $scope.compGroupInfos = $scope.allCompGroupInfos;
                return;
            }
            var searchValue = new Array();
            for(var i = 0; i < $scope.allCompGroupInfos.length; i++) {
                var compGroupInfo = $scope.allCompGroupInfos[i];
                if(compGroupInfo.name.indexOf(searchKey)>=0) {
                    searchValue.push(compGroupInfo);
                }
            }
            $scope.compGroupInfos = searchValue;
        };

        $scope.ok = function () {
            $uibModalInstance.close($scope.selected.compGroupInfo);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        /**
         * 搜索框内的 X 隐藏控制
         */
        $scope.clearSearchKey = function(){
            $('#searchChildItemsValue').val('').focus();
            $('.clear').css('display', 'none');
            // 显示所有数据
            $scope.searchCompGroup();
        };
    }
]);

// 预览合同
angular.module('core').controller('PreviewConstractModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService, FileUploader) {

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

