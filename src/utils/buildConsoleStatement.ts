// utils/buildConsoleStatement.ts
import * as vscode from "vscode";
import { getRandomColor } from "./getRandomColor";

export function buildConsoleStatement(
  selectedText: string,
  currentLineNumber: number,
  fileName: string,
  needLocateIdentifiers: Boolean
): string {
  const config = vscode.workspace.getConfiguration();

  // TODO 多个差异颜色以提供外部模板字符串使用
  const randomColor = getRandomColor();
  const prefix = config.get("prefix") as string || '🚀';
  const templateString = config.get("templateString") as string;

  return templateString
  ? templateString
      .replace(/\${prefix}/g, prefix)
      .replace(/\${selectedText}/g, selectedText)
      .replace(/\${currentLineNumber}/g, currentLineNumber.toString())
      .replace(/\${randomColor}/g, randomColor)
  : selectedText
  ? `console.log(\`%c${prefix}-${fileName}-${selectedText}-${currentLineNumber}:\${${selectedText}}\`, 'color: ${randomColor};font-size:16px');`
  : `console.log(\`%c${prefix}-${fileName}-${currentLineNumber}:${needLocateIdentifiers ? '${$0}' : '${}'}\`, 'color: ${randomColor};font-size:16px');`;
}
