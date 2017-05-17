'use strict';
function getParentNodesName(treeObj){
	if(treeObj==null)return "";
	var parentName = treeObj.nodeName;
	var pNode = treeObj.getParentNode();
	if(pNode!=null && (pNode.nodeType === 4 || pNode.nodeType === 0)){
		parentName = getParentNodesName(pNode)+"/"+parentName;
	}
	return parentName;
 }