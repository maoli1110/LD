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
    "ppid",
    "selectProjectName"
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
            layer.alert('请填写必要的合同信息', {
                closeBtn: 0,
                move: false
            });
            return false;
        }
    }

    if (sendContent["planStartDate"] > sendContent["planEndDate"] || sendContent["actualStartDate"] > sendContent["actualEndDate"]) {
        layer.alert('起始时间不能大于结束时间', {
            closeBtn: 0,
            move: false
        });
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
            layer.alert('请填写必要的合同信息', {
                closeBtn: 0,
                move: false
            });
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
            layer.alert('请填写必要的合同信息', {
                closeBtn: 0,
                move: false
            });
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
            var docList = [], docSelectedList1 = [];
            // 上传成功之后调用更新对UI
            function updateUploadList(response, uploaderSource) {
                if (response[0].type != "error") {
                    var unit = {};
                    unit.name = response[0].result.fileName;
                    unit.md5 = response[0].result.fileMd5;
                    unit.size = response[0].result.fileSize;
                    unit.uuid = response[0].result.uuid;
                    unit.suffix = response[0].result.suffix;
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
            //判断是否包含附件
            if ($scope.uploader.queue.length) {
                $scope.uploader.uploadAll();
                //每个上传成功之后的回调函数
                $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    updateUploadList(response, 'uploader');
                };
                //全部成功的回调函数
                $scope.uploader.onCompleteAll = function () {
                    $scope.onCompleteAllSignal = true;
                    sendContent["contractFiles"] = docList;
                    commonService.createConstruction(sendContent).then(function () {
                        layer.alert('新建成功', {
                            closeBtn: 0,
                            move: false
                        });
                    });
                    $uibModalInstance.close(sendContent);
                    console.log(sendContent);
                    $timeout(function () {
                        $('#ul1-' + deptId).siblings('.project-name-span').trigger('click');
                    })
                };
            }
            if (!$scope.uploader.queue.length) {
                commonService.createConstruction(sendContent).then(function () {
                    layer.alert('新建成功', {
                        closeBtn: 0,
                        move: false
                    });
                });
                $uibModalInstance.close(sendContent);
                console.log(sendContent);
                $timeout(function () {
                    $('#ul1-' + deptId).siblings('.project-name-span').trigger('click');
                })
            } else {
                //轮询是否上传成功
                var checkUploadInterval = setInterval(function () {
                    if ($scope.onCompleteAllSignal == true && $scope.uploadErrorSignal == false) {
                        clearUploadInterval();
                        saveCooperation();
                    } else if ($scope.uploadErrorSignal == true) {
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
                angular.forEach($scope.uploadDocList, function (value, key) {
                    var a = {};
                    a.fileMd5 = value.md5;
                    a.fileName = value.name;
                    a.fileUUID = value.uuid;
                    a.fileSize = value.size;
                    a.id = key;
                    // a.sourceType = scope.beSourceType;
                    docSelectedList1.push(a);
                });
                return docSelectedList1;
            }

            docList = docSelectedList1;
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
// 新建监理合同
angular.module('core').controller('CreateSupervisionModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService, FileUploader) {
        var basePath = "http://192.168.13.215:8080/LBLD/";
        $scope.deptId = deptId;
        $scope.ok = function () {
            if (!checkSupervisionConstractValidity()) return;
            var sendContent = getSupervisionConstractInfo();
            sendContent["deptId"] = $scope.deptId;
            var docList = [], docSelectedList1 = [];
            // 上传成功之后调用更新对UI
            function updateUploadList(response, uploaderSource) {
                if (response[0].type != "error") {
                    var unit = {};
                    unit.name = response[0].result.fileName;
                    unit.md5 = response[0].result.fileMd5;
                    unit.size = response[0].result.fileSize;
                    unit.uuid = response[0].result.uuid;
                    unit.suffix = response[0].result.suffix;
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

            //判断是否包含附件
            if ($scope.uploader.queue.length) {
                $scope.uploader.uploadAll();
                //每个上传成功之后的回调函数
                $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    updateUploadList(response, 'uploader');

                };
                //全部成功的回调函数
                $scope.uploader.onCompleteAll = function () {
                    $scope.onCompleteAllSignal = true;
                    sendContent["contractFiles"] = docList;
                    console.log(sendContent);
                    commonService.createSupervision(sendContent).then(function () {
                        layer.alert('新建成功', {
                            closeBtn: 0,
                            move: false
                        });
                    });
                    $uibModalInstance.close(sendContent);
                    $timeout(function () {
                        $('#ul1-' + deptId).siblings('.project-name-span').trigger('click').slideDown(300);
                    })
                };
            }
            if (!$scope.uploader.queue.length) {
                commonService.createSupervision(sendContent).then(function () {
                    layer.alert('新建成功', {
                        closeBtn: 0,
                        move: false
                    });
                });
                $uibModalInstance.close(sendContent);
                $timeout(function () {
                    $('#ul1-' + deptId).siblings('.project-name-span').trigger('click').slideDown(300);
                })
            } else {
                //轮询是否上传成功
                var checkUploadInterval = setInterval(function () {
                    if ($scope.onCompleteAllSignal == true && $scope.uploadErrorSignal == false) {
                        clearUploadInterval();
                        saveCooperation();
                    } else if ($scope.uploadErrorSignal == true) {
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
                angular.forEach($scope.uploadDocList, function (value, key) {
                    var a = {};
                    a.fileMd5 = value.md5;
                    a.fileName = value.name;
                    a.fileUUID = value.uuid;
                    a.fileSize = value.size;
                    a.id = key;
                    docSelectedList1.push(a);
                });
                return docSelectedList1;
            }

            docList = docSelectedList1;
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
// 新建监理试验室合同
angular.module('core').controller('CreateSupervisionLabModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService, FileUploader) {
        $scope.deptId = deptId;
        // console.log(deptId);
        $scope.ok = function () {
            if (!checkSupervisionLabConstractValidity()) return;
            var sendContent = getSupervisionLabConstractInfo();
            sendContent["deptId"] = $scope.deptId;
            var docList = [], docSelectedList1 = [];
            // 上传成功之后调用更新对UI
            function updateUploadList(response, uploaderSource) {
                if (response[0].type != "error") {
                    var unit = {};
                    unit.name = response[0].result.fileName;
                    unit.md5 = response[0].result.fileMd5;
                    unit.size = response[0].result.fileSize;
                    unit.uuid = response[0].result.uuid;
                    unit.suffix = response[0].result.suffix;
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
            //判断是否包含附件
            if ($scope.uploader.queue.length) {
                $scope.uploader.uploadAll();
                //每个上传成功之后的回调函数
                $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    updateUploadList(response, 'uploader');
                };
                //全部成功的回调函数
                $scope.uploader.onCompleteAll = function () {
                    $scope.onCompleteAllSignal = true;
                    sendContent["contractFiles"] = docList;
                    commonService.createSupervisionLaboratory(sendContent).then(function () {
                        layer.alert('新建成功', {
                            closeBtn: 0,
                            move: false
                        });
                    });
                    console.log(sendContent);
                    $uibModalInstance.close(sendContent);
                    $timeout(function () {
                        $('#ul1-' + deptId).siblings('.project-name-span').trigger('click').slideDown(300);
                    })
                };
            }
            if (!$scope.uploader.queue.length) {
                commonService.createSupervisionLaboratory(sendContent).then(function () {
                    layer.alert('新建成功', {
                        closeBtn: 0,
                        move: false
                    });
                });
                console.log(sendContent);
                $uibModalInstance.close(sendContent);
                $timeout(function () {
                    $('#ul1-' + deptId).siblings('.project-name-span').trigger('click').slideDown(300);
                })
            } else {
                //轮询是否上传成功
                var checkUploadInterval = setInterval(function () {
                    if ($scope.onCompleteAllSignal == true && $scope.uploadErrorSignal == false) {
                        clearUploadInterval();
                        saveCooperation();
                    } else if ($scope.uploadErrorSignal == true) {
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
                angular.forEach($scope.uploadDocList, function (value, key) {
                    var a = {};
                    a.fileMd5 = value.md5;
                    a.fileName = value.name;
                    a.fileUUID = value.uuid;
                    a.fileSize = value.size;
                    a.id = key;
                    docSelectedList1.push(a);
                });
                return docSelectedList1;
            }

            docList = docSelectedList1;
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
            var docList = [], docSelectedList1 = [];
            // 上传成功之后调用更新对UI
            function updateUploadList(response, uploaderSource) {
                if (response[0].type != "error") {
                    var unit = {};
                    unit.name = response[0].result.fileName;
                    unit.md5 = response[0].result.fileMd5;
                    unit.size = response[0].result.fileSize;
                    unit.uuid = response[0].result.uuid;
                    unit.suffix = response[0].result.suffix;
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
            //判断是否包含附件
            if ($scope.uploader.queue.length) {
                $scope.uploader.uploadAll();
                //每个上传成功之后的回调函数
                $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    updateUploadList(response, 'uploader');
                };
                //全部成功的回调函数
                $scope.uploader.onCompleteAll = function () {
                    $scope.onCompleteAllSignal = true;
                    sendContent["contractFiles"] = docList;
                    commonService.createConstruction(sendContent).then(function () {
                        layer.alert('编辑成功', {
                            closeBtn: 0,
                            move: false
                        });
                    });
                    $uibModalInstance.close(sendContent);
                    $timeout(function () {
                        $('#contract_' + $scope.id).trigger('click');
                    });
                };
            }
            if (!$scope.uploader.queue.length) {
                commonService.createConstruction(sendContent).then(function () {
                    layer.alert('编辑成功', {
                        closeBtn: 0,
                        move: false
                    });
                });
                $uibModalInstance.close(sendContent);
                $timeout(function () {
                    $('#contract_' + $scope.id).trigger('click');
                });
            } else {
                //轮询是否上传成功
                var checkUploadInterval = setInterval(function () {
                    if ($scope.onCompleteAllSignal == true && $scope.uploadErrorSignal == false) {
                        clearUploadInterval();
                        saveCooperation();
                    } else if ($scope.uploadErrorSignal == true) {
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
                angular.forEach($scope.uploadDocList, function (value, key) {
                    var a = {};
                    a.fileMd5 = value.md5;
                    a.fileName = value.name;
                    a.fileUUID = value.uuid;
                    a.fileSize = value.size;
                    a.id = key;
                    a.sectionContractId = $scope.id;
                    docSelectedList1.push(a);
                });
                return docSelectedList1;
            }

            docList = docSelectedList1;
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
            var docList = [], docSelectedList1 = [];
            // 上传成功之后调用更新对UI
            function updateUploadList(response, uploaderSource) {
                if (response[0].type != "error") {
                    var unit = {};
                    unit.name = response[0].result.fileName;
                    unit.md5 = response[0].result.fileMd5;
                    unit.size = response[0].result.fileSize;
                    unit.uuid = response[0].result.uuid;
                    unit.suffix = response[0].result.suffix;
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
            //判断是否包含附件
            if ($scope.uploader.queue.length) {
                $scope.uploader.uploadAll();
                //每个上传成功之后的回调函数
                $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    updateUploadList(response, 'uploader');
                };
                //全部成功的回调函数
                $scope.uploader.onCompleteAll = function () {
                    $scope.onCompleteAllSignal = true;
                    sendContent["contractFiles"] = docList;
                    commonService.createSupervision(sendContent).then(function () {
                        layer.alert('编辑成功', {
                            closeBtn: 0,
                            move: false
                        });
                    });
                    $uibModalInstance.close(sendContent);
                    $timeout(function () {
                        $('#contract_' + $scope.id).trigger('click');
                    });
                };
            }
            if (!$scope.uploader.queue.length) {
                commonService.createSupervision(sendContent).then(function () {
                    layer.alert('编辑成功', {
                        closeBtn: 0,
                        move: false
                    });
                });
                $uibModalInstance.close(sendContent);
                $timeout(function () {
                    $('#contract_' + $scope.id).trigger('click');
                });
            } else {
                //轮询是否上传成功
                var checkUploadInterval = setInterval(function () {
                    if ($scope.onCompleteAllSignal == true && $scope.uploadErrorSignal == false) {
                        clearUploadInterval();
                        saveCooperation();
                    } else if ($scope.uploadErrorSignal == true) {
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
                angular.forEach($scope.uploadDocList, function (value, key) {
                    var a = {};
                    a.fileMd5 = value.md5;
                    a.fileName = value.name;
                    a.fileUUID = value.uuid;
                    a.fileSize = value.size;
                    a.id = key;
                    a.sectionContractId = $scope.id;
                    docSelectedList1.push(a);
                });
                return docSelectedList1;
            }

            docList = docSelectedList1;
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
// 编辑监理试验室合同
angular.module('core').controller('EditSupervisionLabModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, $labItems, $timeout, commonService, FileUploader) {
        console.log($labItems);
        $scope.deptId = $labItems.deptId;
        $scope.id = $labItems.id;
        $scope.labConstractInfos = $labItems.labConstractInfos;
        $scope.ok = function () {
            if (!checkSupervisionLabConstractValidity()) return;
            var sendContent = getSupervisionLabConstractInfo();
            sendContent["deptId"] = $scope.deptId;
            sendContent["id"] = $scope.id;
            var docList = [], docSelectedList1 = [];
            // 上传成功之后调用更新对UI
            function updateUploadList(response, uploaderSource) {
                if (response[0].type != "error") {
                    var unit = {};
                    unit.name = response[0].result.fileName;
                    unit.md5 = response[0].result.fileMd5;
                    unit.size = response[0].result.fileSize;
                    unit.uuid = response[0].result.uuid;
                    unit.suffix = response[0].result.suffix;
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
            //判断是否包含附件
            if ($scope.uploader.queue.length) {
                $scope.uploader.uploadAll();
                //每个上传成功之后的回调函数
                $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    updateUploadList(response, 'uploader');
                };
                //全部成功的回调函数
                $scope.uploader.onCompleteAll = function () {
                    $scope.onCompleteAllSignal = true;
                    sendContent["contractFiles"] = docList;
                    commonService.createSupervisionLaboratory(sendContent).then(function () {
                        layer.alert('编辑成功', {
                            closeBtn: 0,
                            move: false
                        });
                    });
                    console.log(sendContent);
                    $uibModalInstance.close(sendContent);
                    $timeout(function () {
                        $('#contract_' + $scope.id).trigger('click');
                    });
                };
            }
            if (!$scope.uploader.queue.length) {
                commonService.createSupervisionLaboratory(sendContent).then(function () {
                    layer.alert('编辑成功', {
                        closeBtn: 0,
                        move: false
                    });
                });
                console.log(sendContent);
                $uibModalInstance.close(sendContent);
                $timeout(function () {
                    $('#contract_' + $scope.id).trigger('click');
                });
            } else {
                //轮询是否上传成功
                var checkUploadInterval = setInterval(function () {
                    if ($scope.onCompleteAllSignal == true && $scope.uploadErrorSignal == false) {
                        clearUploadInterval();
                        saveCooperation();
                    } else if ($scope.uploadErrorSignal == true) {
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
                angular.forEach($scope.uploadDocList, function (value, key) {
                    var a = {};
                    a.fileMd5 = value.md5;
                    a.fileName = value.name;
                    a.fileUUID = value.uuid;
                    a.fileSize = value.size;
                    a.id = key;
                    a.sectionContractId = $scope.id;
                    docSelectedList1.push(a);
                });
                return docSelectedList1;
            }

            docList = docSelectedList1;
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
            var $select = $(".select");
            $select.remove();
            commonService.deleteConstruction(id).then(function () {
                layer.alert('删除成功', {
                    closeBtn: 0,
                    move: false
                });
            });
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
            var $select = $(".select");
            $select.remove();
            commonService.deleteSupervision(id).then(function () {
                layer.alert('删除成功', {
                    closeBtn: 0,
                    move: false
                })
            });
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
            var $select = $(".select");
            $select.remove();
            commonService.deleteSupervisionLaboratory(id).then(function () {
                layer.alert('删除成功', {
                    closeBtn: 0,
                    move: false
                })
            });
            $uibModalInstance.close($scope.id);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

// 删除附件
angular.module('core').controller('deleteAttachmentModal', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, items, $timeout, commonService, FileUploader) {
        console.log(items);
        var attachmentId = items.id;
        var windowStatus = items.windowStatus;
        $scope.ok = function (_this) {
            

            if (attachmentId) {
                // commonService.deleteContractAttachment(id);
            }
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

// 预览合同
angular.module('core').controller('PreviewConstractModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, contractFiles, $timeout, commonService, FileUploader) {

        $scope.contractFiles = contractFiles;
console.log(contractFiles);
        $scope.$on('contractFilesNgRepeatFinished', function () {
            $('#preview-body').slidePDF({
                pic: ".pdf-preview",//大图框架
                pnum: ".preview-menu",//小图框架
                // prev: ".pdf-left-arrow",//大图左箭头
                // next: ".pdf-right-arrow",//大图右箭头
                delayTime: 400,//切换一张图片时间
                order: 0,//当前显示的图片（从0开始）
                picdire: true,//大图滚动方向（true为水平方向滚动）
                mindire: true,//小图滚动方向（true为水平方向滚动）
                min_picnum: 5//小图显示数量
            })
        })

        // var docList = [], docSelectedList1 = [];
        // // 上传成功之后调用更新对UI
        // function updateUploadList(response, uploaderSource) {
        //     if (response[0].type != "error") {
        //         var unit = {};
        //         unit.name = response[0].result.fileName;
        //         unit.md5 = response[0].result.fileMd5;
        //         unit.size = response[0].result.fileSize;
        //         unit.uuid = response[0].result.uuid;
        //         unit.suffix = response[0].result.suffix;
        //         $scope.uploadDocList.push(unit);
        //     } else {	// 提交失败 弹框提示
        //         layer.open({
        //             type: 1,
        //             title: false,
        //             closeBtn: 0,
        //             shadeClose: true,
        //             skin: 'yourclass',
        //             move: false,
        //             content: '<div class="tips">' + response[0].info + '</div><div class="tips_ok" onclick="layer.closeAll();">好</div>'
        //         });
        //         return;
        //     }
        // }
        //
        // $scope.uploader.onErrorItem = function (item, response, status, headers) {
        //     layer.closeAll();
        //     $timeout(function () {
        //         if (!$scope.uploadErrorSignal) {
        //             layer.alert("网络错误，上传失败，请重新上传！", {
        //                 title: '提示',
        //                 closeBtn: 0,
        //                 move: false
        //             });
        //
        //             $scope.uploader.cancelAll();
        //             $scope.uploader.clearQueue();
        //             $scope.uploadErrorSignal = true;
        //         }
        //     }, 1000)
        // }
        // //判断是否包含附件
        // if ($scope.uploader.queue.length) {
        //     $scope.uploader.uploadAll();
        //     //每个上传成功之后的回调函数
        //     $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
        //         updateUploadList(response, 'uploader');
        //     };
        //     //全部成功的回调函数
        //     $scope.uploader.onCompleteAll = function () {
        //         $scope.onCompleteAllSignal = true;
        //
        //     };
        // }
        // if (!$scope.uploader.queue.length) {
        //
        // } else {
        //     //轮询是否上传成功
        //     var checkUploadInterval = setInterval(function () {
        //         if ($scope.onCompleteAllSignal == true && $scope.uploadErrorSignal == false) {
        //             clearUploadInterval();
        //             saveCooperation();
        //         } else if ($scope.uploadErrorSignal == true) {
        //             clearUploadInterval();
        //             $scope.uploadErrorSignal = false;
        //         }
        //     }, 100);
        // }
        // //清除轮询
        // function clearUploadInterval() {
        //     clearInterval(checkUploadInterval);
        // }
        //
        // function saveCooperation() {
        //     //拼接资料数组
        //     angular.forEach($scope.uploadDocList, function (value, key) {
        //         var a = {};
        //         a.fileMd5 = value.md5;
        //         a.fileName = value.name;
        //         a.fileUUID = value.uuid;
        //         a.fileSize = value.size;
        //         a.id = key;
        //         a.sectionContractId = $scope.id;
        //         docSelectedList1.push(a);
        //     });
        //     return docSelectedList1;
        // }
        // docList = docSelectedList1;
        // console.log(docList);
        $uibModalInstance.close($scope.contractFiles);

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

