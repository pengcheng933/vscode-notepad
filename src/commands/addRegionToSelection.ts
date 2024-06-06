import * as vscode from "vscode";
import { buildConsoleStatement } from "../utils/buildConsoleStatement";
import { getFileName } from "../utils";


export const insertConsoleStatement = () => {
  return vscode.commands.registerCommand('xpc.printLog',()=>{
    const editor = vscode.window.activeTextEditor;

    if (editor && editor.selections.length > 0) {
      editor.edit(async (editBuilder) => {
        // 获取当前选择范围
        const selection = editor.selection;
        // 获取当前选择文本
        const selectedText = editor.document.getText(selection);
        const fileName = getFileName(editor.document.fileName);
        // 当前行树
        const currentLineNumber = selection.active.line;
        const currentLineText = editor.document.lineAt(currentLineNumber).text;
        const currentLineIndentation = currentLineText.match(/^\s*/)?.[0] || '';
        const insertCurrentLineNumber = selectedText ? currentLineNumber+3 : currentLineNumber+2;
        // 获取插入文本
        const consoleStatement = `// log\n${currentLineIndentation}${buildConsoleStatement(selectedText, insertCurrentLineNumber, fileName, false)}\n${currentLineIndentation}// endLog\n`;
        const insertLineNumber = selectedText ? currentLineNumber + 1 :currentLineNumber;
        // 插入到文本中
        await editBuilder.insert(new vscode.Position(insertLineNumber, 0), currentLineIndentation + consoleStatement);
        let newPosition;
        // 移动光标到指定位置，有选择文本的到插入文本后一行，没得选择文本到{}里输入要打印内容
         if(!selectedText){
         // 新的选择范围，将光标移动到文档的第一行末尾
         newPosition = new vscode.Position(currentLineNumber+1, consoleStatement.split('\n')[1].indexOf('{')+1);
         }else{
          newPosition = new vscode.Position(currentLineNumber+4, currentLineIndentation.length);
         }
         const newSelection = new vscode.Selection(newPosition, newPosition);
         // 设置新的选择范围
         editor.selection = newSelection;
      })
    }
  });
};