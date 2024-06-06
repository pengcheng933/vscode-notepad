import * as vscode from 'vscode';
import { findSpecialComments } from './index';
import { Correspond } from './correspond';

export const getCommentLines = (document:vscode.TextDocument,context:vscode.ExtensionContext) => {
    const fileName = document.fileName;
    const workspace = context.workspaceState;

    const specialCommentsObj = findSpecialComments(document.getText());
    console.log(specialCommentsObj, 'specialCommentsObj');
    
    if(Object.keys(specialCommentsObj).length>0){
        workspace.update(fileName, specialCommentsObj);
        Correspond.webview && Correspond.sendMessage('updateDate', {
            filePath: fileName,
            data: specialCommentsObj
        });
    } else {
        // undefined 删除键值
        workspace.update(fileName, undefined);
        Correspond.webview && Correspond.sendMessage('deleteDate', {
            filePath: fileName,
            data: ''
        });
    }
};