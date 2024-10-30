import * as vscode from 'vscode';
import { Picker } from './picker/picker';
import { JSDoc, Project, ts } from "ts-morph";
import { TsFileParser } from './parser/tsFileParser';
import { ClassAnnotation } from './annotation/annotation';
let m = new Map()
export function activate(context: vscode.ExtensionContext) {

  const disposable = vscode.commands.registerCommand('addAnnotation', () => {
    // 获取文本编辑器
    const editor = vscode.window.activeTextEditor;
    // 获取失败提示信息
    if (!editor) {
      vscode.window.showErrorMessage("需选择类或方法代码");
      return;
    }
    // 创建拾取器对象拾取光标所在单词和文件名以及行号
    const picker = new Picker(editor)
    const fileName = picker.pickFileName()
    const wordText = picker.pickCursorWordText()
    const lineNumber = picker.pickLineNumber()
    // 解析ts文件为语法树
    const tsFileParser = new TsFileParser()
    const sourceFile = tsFileParser.parse(fileName)
    // 获取单词对应的成员信息
    const memberDeclaration = tsFileParser.getMemberInfoByName(sourceFile, wordText, lineNumber);

    if (memberDeclaration) {
      let a = memberDeclaration.addJsDoc(`\n
做一些事情
@param {Array<number>} 参数数组
        \n`)
    }
    // 保存更改到文件  
    sourceFile.saveSync();
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
