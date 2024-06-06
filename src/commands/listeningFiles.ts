import * as vscode from 'vscode';
import { debounceGetCommentLines } from '../utils';

export const listeningFilesOpen = (context: vscode.ExtensionContext) => {
    // 监听文件打开事件
    return vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            const document = editor.document;
            debounceGetCommentLines(document, context);
        }
    });
};
export const listeningFilesSave = (context: vscode.ExtensionContext) => {
    // 监听文件保存事件
    return vscode.workspace.onDidSaveTextDocument((document:vscode.TextDocument)=>{
        debounceGetCommentLines(document, context);
    });
};
