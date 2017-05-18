


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
angular.module('core').controller('CreateChangeStakeModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader','$uibModal',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService, FileUploader,$uibModal) {
        $scope.newList={
                    "totalCount":7,
                    "pageSize":3,
                    "pageNumber":1,
                    "totalPage": 3,
                    "content": [
                        {
                            "id": "1",
                            "listNum": "201-1",
                            "itemName": "钻孔灌注桩",
                            "measurementUnit": "m3",
                            "contractPrice": "452.36",
                            "contractQuantity": "156785.3",
                            "contractAmount": "2586.3",
                        },
                        {   "id": "2",
                            "listNum": "201-2",
                            "itemName": "钻孔灌注桩2",
                            "measurementUnit": "m3",
                            "contractPrice": "452.36",
                            "contractQuantity": "156785.3",
                            "contractAmount": "2586.3",
                        },
                        {
                            "id": "3",
                            "listNum": "201-3",
                            "itemName": "钻孔灌注桩3",
                            "measurementUnit": "m3",
                            "contractPrice": "452.36",
                            "contractQuantity": "156785.3",
                            "contractAmount": "2586.3",
                        },
                        {
                            "id": "4",
                            "listNum": "201-4",
                            "itemName": "钻孔灌注桩4",
                            "measurementUnit": "m3",
                            "contractPrice": "452.36",
                            "contractQuantity": "156785.3",
                            "contractAmount": "2586.3",
                        },
                        {   "id": "5",
                            "listNum": "201-5",
                            "itemName": "钻孔灌注桩5",
                            "measurementUnit": "m3",
                            "contractPrice": "452.36",
                            "contractQuantity": "156785.3",
                            "contractAmount": "2586.3",
                        }
                    ]
                }
        /**
         * 搜索框搜索功能实现
         */
        $scope.searchChildItems = function(){

            var queryParam = $("#searchChildItemsValue").val();
            pageParam.queryParam = queryParam;
            pageParam.pageNumber = 1;
            commonService.findChildItemizedInfos(pageParam, sectionContractId).then(function(data){
                $scope.childItemizedInfos = data.data;
            });
        };
        /**
         * 搜索框内的 X 隐藏控制
         */
        $scope.clearSearchKey = function(){
            // 当内容页也有搜索框时，用class定位会出错，故改为id定位
            $('#searchChildItemsValue').val('').focus();
            $('#clearSearchKey').css('display', 'none');
        };



        $scope.deptId = deptId;

        $scope.delBuild=function(delBuildVlu){
                $scope.delBuildVlu="";
        }
        $scope.ok = function () {
        	alert("签发变更令")
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };



//点此新建清单

        $scope.animationsEnabled = true;
        $scope.modalCreatChangeNew = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_third/modal_creat_change_new.html',
                controller: 'CreateChangeNewModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.deptId;
                    }
                }
            });
            modalInstance.result.then(function (sendContent) {
                // $scope.selected = selectedItem;
                // console.log(selectedItem);
            });
        };

//选择清单        
        $scope.modalCreatChangeList = function () {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                size: 'lg',
                templateUrl: 'template/category_third/modal_create_change_list.html',
                controller: 'CreateChangeListModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.deptId;
                    }
                }
            });
            modalInstance.result.then(function (sendContent) {
                // $scope.selected = selectedItem;
                // console.log(selectedItem);
            });
        };
    
    }
]);



//删除变更
angular.module('core').controller('CreateChangeDeleteorderPreview', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
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
        $scope.chapter=[{"id":100},{"id":300},{"id":200}]
        $scope.serial=[{"id":101},{"id":302},{"id":204}]
        $scope.changenNumber=$scope.chapter[0].id;
        $scope.changeallNumber=$scope.serial[0].id;
        //新建清单数据id
        var addChangeNew=[
            'newchapter',
            'newserial',
            'newname',
            'newiserialr',
            'newiname',
            'newunit',
            'newelement'
        ]
        //新建清单数据获取
        function getChangeNewInfo() {
            var sendContent = {};
            for (var i = 0, len = addChangeNew.length; i < len; i++) {
                var key = addChangeNew[i];
                var $input = $("#" + key);
                if ($input.length != 0) {
                    sendContent[key] = $input.val();
                }
            }
            return sendContent;
        }

        // 验证新建清单信息
        function checkChangeNewInfo() {
            var sendContent = getChangeNewInfo();
            var requireKeyId = [
                'newchapter',
                'newserial',
                'newname',
                'newiserialr',
                'newiname',
                'newunit',
                'newelement'
            ];

            for (var i = 0; i < requireKeyId.length; i++) {
                if ($('#' + requireKeyId[i]).hasClass("ng-invalid-required")) {
                    layer.alert('请填写必要的清单信息', {
                        closeBtn: 0,
                        move: false
                    });
                    return false;
                }
                if ($('#' + requireKeyId[i]).hasClass("ng-invalid-maxlength")) {
                    layer.alert('清单信息格式有误', {
                        closeBtn: 0,
                        move: false
                    });
                    return false;
                }
            }
            return true;
        }
        $scope.ok=function(){
            if (!checkChangeNewInfo()) return;
            var sendContent = getChangeNewInfo();
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
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);

// 选择清单
angular.module('core').controller('CreateChangeListModalCtrl', ['$scope', '$http', '$uibModalInstance', 'items', '$timeout', 'commonService', 'FileUploader',
    function ($scope, $http, $uibModalInstance, deptId, $timeout, commonService, FileUploader) {
        $scope.childItemizedInfos={
                    "totalCount":7,
                    "pageSize":3,
                    "pageNumber":1,
                    "totalPage": 3,
                    "content": [
                        {
                            "id": "1",
                            "listNum": "201-1",
                            "itemName": "钻孔灌注桩",
                            "measurementUnit": "m3",
                            "contractPrice": "452.36",
                            "contractQuantity": "156785.3",
                            "contractAmount": "2586.3",
                        },
                        {   "id": "2",
                            "listNum": "201-2",
                            "itemName": "钻孔灌注桩2",
                            "measurementUnit": "m3",
                            "contractPrice": "452.36",
                            "contractQuantity": "156785.3",
                            "contractAmount": "2586.3",
                        },
                        {
                            "id": "3",
                            "listNum": "201-3",
                            "itemName": "钻孔灌注桩3",
                            "measurementUnit": "m3",
                            "contractPrice": "452.36",
                            "contractQuantity": "156785.3",
                            "contractAmount": "2586.3",
                        },
                        {
                            "id": "4",
                            "listNum": "201-4",
                            "itemName": "钻孔灌注桩4",
                            "measurementUnit": "m3",
                            "contractPrice": "452.36",
                            "contractQuantity": "156785.3",
                            "contractAmount": "2586.3",
                        },
                        {   "id": "5",
                            "listNum": "201-5",
                            "itemName": "钻孔灌注桩5",
                            "measurementUnit": "m3",
                            "contractPrice": "452.36",
                            "contractQuantity": "156785.3",
                            "contractAmount": "2586.3",
                        }
                    ]
                }

        $scope.changeClass = function(target){
             if (target.getAttribute("class")){
                 target.setAttribute("class","");
                //  var thisID = this.item.id;
                // $.each($scope.newList,function(index,value){
                //   if(value){
                //     if(thisID==value.id){
                //      $scope.newList.splice(index,1);
                //      $scope.idArr.splice(index,1);
                //      //console.log($scope.idArr)
                //     }
                  
                //   }
                  
                //   })
              }else{
                target.setAttribute("class","active");
                 // $scope.newList.push($scope.childItemizedInfos.content[this.$index]);
                 // $scope.idArr.push($scope.childItemizedInfos.content[this.$index].id);
           };

        };

        $scope.lists=[{"id":100},{"id":300},{"id":200}];
        $scope.myValue="alllist";

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

