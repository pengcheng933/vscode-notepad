import * as vscode from "vscode";
import { buildConsoleStatement } from "../utils/buildConsoleStatement";
import { getFileName, capitalizeFirstLetter } from "../utils/index";

export const getCodeTip = () => {
  return vscode.languages.registerCompletionItemProvider(
    "javascript",
    {
      provideCompletionItems(
        doc: vscode.TextDocument,
        position: vscode.Position
      ) {
        // 获取当前行文本
        const lineText = doc
        .lineAt(position)
        .text;
        const linePrefix = lineText.substr(0, position.character)
          .trim();
        // 当前行号 2的原因是从0开始，还要换行
        const currentLineNumber = position.line + 2;
        
        //  当前文件名
        const fileName = getFileName(doc.fileName);
        // 获取当前行的缩进
        const currentLineIndentation = lineText.match(/^\s*/)?.[0] || '';
        

        if (/^\/|\/\/\s*(test|log|todo)\s/.test(linePrefix)) {
          // 定义替换范围
          const startPos = position.with(
            position.line,
            linePrefix.lastIndexOf("//")
          );
          const endPos = position.with(position.line, linePrefix.length);

          const arrOptions = ['test', 'log', 'todo'];
          // 拼接获取要打印的字符串
          const arrStr = arrOptions.map(item=>{
            let text = item === 'log' ? buildConsoleStatement("", currentLineNumber, fileName, true) : '$0';
            text = (item === 'todo' ? '// ' : '') + text;
            return  `${currentLineIndentation}// ${item}\n${currentLineIndentation}${text}\n${currentLineIndentation}// end${capitalizeFirstLetter(item)}\n`;
          });
          const arr = new Array(3).fill(null).map((unused, index) => {
            const item = new vscode.CompletionItem(
              arrStr[index],
              vscode.CompletionItemKind.Snippet
            );
            item.range = new vscode.Range(startPos, endPos);
            // 实际插入的代码片段，可以定位到&0位置
            item.insertText = new vscode.SnippetString(arrStr[index]);
            return item;
          });
          return arr;
        }
        return undefined;
      },
    },
    "/"
  );
};
