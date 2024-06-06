// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getCodeTip } from "./commands/addRegionCodeTip";
import { insertConsoleStatement } from "./commands/addRegionToSelection";
import { listeningFilesOpen, listeningFilesSave } from "./commands/listeningFiles";
import { regionNotepadSidebar } from "./commands/addRegionNotepadSidebar";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  regionNotepadSidebar(context);
  context.subscriptions.push(getCodeTip());
  context.subscriptions.push(insertConsoleStatement());
  context.subscriptions.push(listeningFilesOpen(context));
  context.subscriptions.push(listeningFilesSave(context));
}


// This method is called when your extension is deactivated
export function deactivate() {}
