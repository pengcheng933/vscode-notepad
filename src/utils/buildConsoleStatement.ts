// utils/buildConsoleStatement.ts
import * as vscode from "vscode";
import { getRandomColor } from "./getRandomColor";

export function buildConsoleStatement(
  selectedText: string,
  currentLineNumber: number
): string {
  const config = vscode.workspace.getConfiguration();

  // TODO 多个差异颜色以提供外部模板字符串使用
  const randomColor = getRandomColor();
  const prefix = config.get("prefix") as string;
  const templateString = config.get("templateString") as string;

  return templateString
  ? templateString
      .replace(/\${prefix}/g, prefix)
      .replace(/\${selectedText}/g, selectedText)
      .replace(/\${currentLineNumber}/g, currentLineNumber.toString())
      .replace(/\${randomColor}/g, randomColor)
  : selectedText
  ? `// log\nconsole.log('%c${prefix}[${selectedText}]-${currentLineNumber}:', 'color: ${randomColor}', ${selectedText});\n// endLog\n`
  : `console.log(' %c${prefix}${currentLineNumber}:', 'color: ${randomColor}',);`;
}
