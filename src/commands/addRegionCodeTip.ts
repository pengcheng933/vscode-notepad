import * as vscode from "vscode";
import { buildConsoleStatement } from "../utils/buildConsoleStatement";

export const getCodeTip = () => {
  return vscode.languages.registerCompletionItemProvider(
    "javascript",
    {
      provideCompletionItems(
        doc: vscode.TextDocument,
        position: vscode.Position
      ) {
        const linePrefix = doc
          .lineAt(position)
          .text.substr(0, position.character)
          .trim();
        console.log(linePrefix, "111");
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          const selectedText = editor.document.getText(editor.selection);
          const currentLineNumber = editor.selection.active.line;
          console.log(currentLineNumber, "222");

          const currentLineText =
            editor.document.lineAt(currentLineNumber).text;
          console.log(currentLineText, "333");
        }

        if (/^\/|\/\/\s*(test|log|todo)\s/.test(linePrefix)) {
          console.log(linePrefix);
          const completionItem = new vscode.CompletionItem(
            "// test\n// endTest",
            vscode.CompletionItemKind.Snippet
          );
          // 定义替换范围
          const startPos = position.with(
            position.line,
            linePrefix.lastIndexOf("//")
          );
          console.log(startPos);

          const endPos = position.with(position.line, linePrefix.length);
          console.log(endPos);
          const arrStr = [
            "// test\n// endTest",
            "// log\n// endLog",
            "// todo\n// endTodo",
          ];
          //   const consoleStatement = buildConsoleStatement(
          //     selectedText,
          //     currentLineNumber + 2
          //   );
          const consoleStatement = buildConsoleStatement("test", 2);
          console.log(consoleStatement);

          const arr = new Array(3).fill(null).map((unused, index) => {
            const item = new vscode.CompletionItem(
              arrStr[index],
              vscode.CompletionItemKind.Snippet
            );
            item.range = new vscode.Range(startPos, endPos);
            return item;
          });
          console.log(arr);
          return arr;
          //   return [
          //     new vscode.CompletionItem(
          //       "// test\n// endTest",
          //       vscode.CompletionItemKind.Snippet
          //     ),
          //     new vscode.CompletionItem(
          //       "// log\n// endLog",
          //       vscode.CompletionItemKind.Snippet
          //     ),
          //     new vscode.CompletionItem(
          //       "// todo\n// endTodo",
          //       vscode.CompletionItemKind.Snippet
          //     ),
          //   ];
        }
        return undefined;
      },
    },
    "/"
  );
};
