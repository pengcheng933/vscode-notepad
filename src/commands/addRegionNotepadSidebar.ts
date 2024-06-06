import * as vscode from "vscode";
import {notepadSidebarProvider} from "../utils/notepadSidebarProvider"

export const regionNotepadSidebar = (context:vscode.ExtensionContext) => {
    vscode.window.registerWebviewViewProvider('package-dependencies', new notepadSidebarProvider(context))
}