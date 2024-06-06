import * as vscode from 'vscode'
import { Correspond } from './correspond';

export class notepadSidebarProvider implements vscode.WebviewViewProvider {
  private _context: vscode.ExtensionContext;
  private _extensionUri: vscode.Uri; 
  constructor(context: vscode.ExtensionContext) {
    this._context = context
    this._extensionUri = context.extensionUri
  }
  // 实现 resolveWebviewView 方法，用于处理 WebviewView 的创建和设置
  resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
    // 配置 WebviewView 的选项
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._context.extensionUri]
    };
    // 配置URL地址
    const baseUri = webviewView.webview.asWebviewUri(vscode.Uri.joinPath(
        this._extensionUri, 'web/dist')
        ).toString().replace('%22', '');
    Correspond.setParams(this._context, webviewView.webview);
    // 设置 WebviewView 的 HTML 内容，可以在这里指定要加载的网页内容
    webviewView.webview.html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vite App</title>
        <script type="module" crossorigin src="${baseUri}/assets/index-Cr93fP4Q.js""></script>
        <link rel="stylesheet" crossorigin href="${baseUri}/assets/index-DYRl_2Bg.css">
      </head>
      <body>
        <div id="app"></div>
      </body>
    </html>`;
  }
}