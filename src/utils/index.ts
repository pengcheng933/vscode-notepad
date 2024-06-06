import * as vscode from "vscode";
import { SpecialComments, DeleteLinesInFileParams, Arg, WorkspaceDate } from "../type/common";
import { getCommentLines } from "./getCommentLines";
import { Correspond } from "./correspond";

// 获取文件名根据路径
export const getFileName = (filePath:string):string => {
    return filePath.substring(filePath.lastIndexOf('/') + 1);
};
// 首字母转换为大写
export const capitalizeFirstLetter=(string:string):string =>{
    return string.charAt(0).toUpperCase() + string.slice(1);
};
// 防抖监听文件打开和保存
const debounceMap = new Map<string, NodeJS.Timeout>();
export const debounceGetCommentLines = (document: vscode.TextDocument, context:vscode.ExtensionContext) => {
    const fileName = document.fileName;
    // 清除上一次的定时器
    if (debounceMap.has(fileName)) {
        clearTimeout(debounceMap.get(fileName));
    }
    // 设置新的定时器
    const timeoutId = setTimeout(() => {
        getCommentLines(document, context);
        debounceMap.delete(fileName);  // 执行后删除对应的定时器条目
    }, 2000);
    // 更新或添加新的定时器条目
    debounceMap.set(fileName, timeoutId);
};

// 获取行数
export  const findSpecialComments=(fileContent:string)=> {
    const lines = fileContent.split('\n');
    const specialComments:SpecialComments = {
    };
    let startLine = 0;
    let inSpecialComment = false;
    let note = '';
    const reg1 = /\/\/\s*(test|log)\s*(.*)$/gm;
    const reg2 = /\/\/\s*todo\s*([\s\S]*?)\/\/\s*endTodo/g;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('// test') || line.startsWith('// log')) {
            if (!inSpecialComment) {
                startLine = i + 1;
                inSpecialComment = true;
                reg1.lastIndex = 0;
                const result = reg1.exec(line);
                if(result && result[2]){
                    note = result[2];
                }
            }
        } else if(line.startsWith('// todo')){
            if (!inSpecialComment) {
                startLine = i + 1;
                inSpecialComment = true;
            }
        } else if (line.startsWith('// endTest') || line.startsWith('// endTodo') || line.startsWith('// endLog')) {
            if (inSpecialComment) {
                if(line.startsWith('// endTodo')){
                    const todoStr = lines.slice(startLine-1, i + 1).join(' ');
                    reg2.lastIndex = 0;
                    const result = reg2.exec(todoStr);
                    if(result && result[1]){
                        note = result[1].replaceAll('// ', '').replaceAll('\n', '');
                    }
                }
                const match = line.match(/\/\/ (endTest|endTodo|endLog)/);
                if (match) {
                    const result = match[0];
                    const key = result.substring(6).toLowerCase();
                    if(!specialComments[key]) {
                        specialComments[key] = [];
                    }
                    console.log(note);
                    
                    specialComments[key].push({
                        startLine: startLine, 
                        endLine: i + 1,
                        note
                    });
                    note = '';
                }
                inSpecialComment = false;
            }
        }
    }
    return specialComments;
};
// 获取工作空间的数据，并拼接成对象返回
export const getWorkspaceAndFormat = (workspace: vscode.Memento):WorkspaceDate => {
    const obj:WorkspaceDate = {};
    workspace.keys().forEach(item=>{
        obj[item] = workspace.get(item) as any;
    });
    return obj;
};
// 接收到webview传递的消息后，删除对应的行数
export const deleteLinesInFile= async ({
    filePath, startLine, endLine, annotationType
}:DeleteLinesInFileParams, context: vscode.ExtensionContext)=> {
    const uri = vscode.Uri.file(filePath);
    const fileContent = await vscode.workspace.fs.readFile(uri);
    const contentString = Buffer.from(fileContent).toString('utf8');
    const lines = contentString.split('\n');
    if(lines[startLine - 1].trim().startsWith('// '+annotationType)){
        lines.splice(startLine - 1, endLine - startLine + 1);
        const updatedData = lines.join('\n');
        let result = '';
        try {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(updatedData));
            // 重新计算注释位置
            const specialCommentsObj = findSpecialComments(updatedData);
            if(Object.keys(specialCommentsObj).length>0){
                context.workspaceState.update(filePath, specialCommentsObj);
                Correspond.webview && Correspond.sendMessage('updateDate', {
                    filePath,
                    data: specialCommentsObj
                });
            } else {
                // undefined 删除键值
                context.workspaceState.update(filePath, undefined);
                Correspond.webview && Correspond.sendMessage('deleteDate', {
                    filePath,
                    data: ''
                });
            }
        } catch (error) {
            result = String(error);
        }finally{
            return {
                filePath,
                startLine,
                endLine,
                annotationType,
                msg: result
            };
        }

    }else {
        return {
            filePath,
            startLine,
            endLine,
            annotationType,
            msg: '不能删除出错了'
        };
    }
};
// 删除成功后更改存储的值
export const removeLogEntry=({
    filePath,
    startLine,
    endLine,
    annotationType,
  }:Arg, workspaceDate:WorkspaceDate) =>{
      if (workspaceDate[filePath] && Array.isArray(workspaceDate[filePath][annotationType])) {
        workspaceDate[filePath][annotationType] = workspaceDate[filePath][annotationType].filter(
              entry => entry.startLine !== startLine || entry.endLine !== endLine
          );
        if(workspaceDate[filePath][annotationType].length === 0){
          delete workspaceDate[filePath][annotationType];
        }
        if(!workspaceDate[filePath]){
            delete workspaceDate[filePath];
        }
      }
  };