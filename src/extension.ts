// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getCodeTip } from "./commands/addRegionCodeTip";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const codeTip = getCodeTip();
  context.subscriptions.push(codeTip);
  let disposable = vscode.commands.registerCommand("xpc.notepad", () => {
    const editor = vscode.window.activeTextEditor;
    console.log(222);
    if (editor && editor.selections.length > 0) {
      editor.edit((editBuilder) => {
        const [firstSelection] = editor.selections;
        const lastSelection = editor.selections.at(-1);
        // 选中的第一个文本和最后一个选中文本的后面插入
        editBuilder.insert(firstSelection.start, "\n// #region\n");
        editBuilder.insert(lastSelection!.end, "\n// #endregion\n");
      });
    }
  });
  context.subscriptions.push(disposable);
  //   vscode.window.registerTreeDataProvider(
  //     "testNoted",
  //     new TestBlocksProvider(vscode.workspace.rootPath as string)
  //   );
}
class TestBlocksProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  constructor(private workspaceRoot: string) {}

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("No workspace opened");
      return Promise.resolve([]);
    }

    return this.getFilesWithTestBlocks();
  }

  private async getFilesWithTestBlocks(): Promise<vscode.TreeItem[]> {
    const files = await vscode.workspace.findFiles(
      "**/*.js",
      "**/node_modules/**"
    );
    const items: vscode.TreeItem[] = [];

    for (const file of files) {
      const document = await vscode.workspace.openTextDocument(file);
      const text = document.getText();
      const regex = /\/\/ test[\s\S]*?\/\/ endTest/g;

      let match;
      while ((match = regex.exec(text))) {
        const range = new vscode.Range(
          document.positionAt(match.index),
          document.positionAt(match.index + match[0].length)
        );
        const location = new vscode.Location(file, range);
        items.push(
          new vscode.TreeItem(
            location.uri.fsPath,
            vscode.TreeItemCollapsibleState.None
          )
        );
      }
    }

    return items;
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
// "views": {
//   "explorer": [
//     {
//       "id": "testBlocksView",
//       "name": "Test Blocks"
//     }
//   ]
// },
// "languages": [
//   {
//     "id": "javascript",
//     "extensions": [
//       ".js"
//     ],
//     "configuration": "./language-configuration.json"
//   }
// ]
