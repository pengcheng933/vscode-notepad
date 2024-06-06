import * as vscode from "vscode";
import { deleteLinesInFile, getWorkspaceAndFormat, removeLogEntry } from ".";
import { WorkspaceDate } from "../type/common";

export class Correspond {
  static context: vscode.ExtensionContext;
  static webview: vscode.Webview;
  static workspaceDate: WorkspaceDate;
  static setParams(
    context: vscode.ExtensionContext,
    webview: vscode.Webview
  ): void {
    this.context = context;
    this.webview = webview;
    this.enableListening();
  }
  static enableListening() {
    // 监听 WebView 发来的消息
    this.webview.onDidReceiveMessage(
       async (message) => {
        // 处理消息
        if (message.command === "getLocality") {
          const workspace = this.context.workspaceState;
          this.workspaceDate = getWorkspaceAndFormat(workspace);
          // 发送消息给 WebView
          this.sendMessage('locality', this.workspaceDate);
        } else if (message.command === "delete") {
          const deleteResult = await deleteLinesInFile(message.arg, this.context);
          if(deleteResult.msg){
            // 有错误
            this.sendMessage('deleteResult', deleteResult);
            return;
          }
          // 成功那么修改本地存储和webview显示
        //   removeLogEntry(deleteResult, this.workspaceDate);
        //   this.context.workspaceState.update(deleteResult.filePath, this.workspaceDate[deleteResult.filePath]);
        //   this.sendMessage('updateDate',{
        //     filePath: deleteResult.filePath,
        //     data: this.workspaceDate[deleteResult.filePath]
        //   });
        }
      },
      undefined,
      this.context.subscriptions
    );
  }
  static sendMessage(command:string, arg:any){
    console.log(arg);
    
    this.webview.postMessage({ command, arg});
  }
}
