import * as vscode from 'vscode';
import { Picker } from './picker/picker';
import { Parser } from './parser/parser';
import { Project, ts } from "ts-morph";
export function activate(context: vscode.ExtensionContext) {

  const disposable = vscode.commands.registerCommand('addAnnotation', () => {
    // 创建一个新的项目实例  
    const project = new Project();
    // 获取激活的文本编辑器
    let editor = vscode.window.activeTextEditor;
    // 获取失败提示信息
    if (!editor) {
      vscode.window.showErrorMessage("需选择类或方法代码");
      return;
    }
    // 获取文档对象
    const document = editor.document;
    // 获取拾取的文件路径
    const fileName = document.fileName
    // 打开或创建一个 TypeScript 文件  
    const sourceFile = project.addSourceFileAtPath(fileName);

    // 查找类和方法（这里需要根据你的实际代码结构来查找）  
    const className = "Person";
    const methodName = "doSome1";

    // 查找类  
    const classDeclaration = sourceFile.getClass(className)!;

    // 查找方法  
    const methodDeclaration = classDeclaration.getMethod(methodName)!;
    // 获取方法声明的开始和结束位置  
    const methodStart = methodDeclaration.getStart();
    const methodEnd = methodDeclaration.getEnd();

    // 准备 JSDoc 注释字符串  
    const jsdocComment = `  
  /**  
   * This is a JSDoc comment for your method.  
   * @param {string} param1 - The first parameter.  
   * @returns {number} - The return value.  
   */  
  `;

    // 添加 JSDoc 注释作为前置注释（leading comment）  
    /*  const methodStart = methodDeclaration.getStart();
     sourceFile.insertText(methodStart, jsdocComment + "\n"); */
    let a = methodDeclaration.addJsDoc("a")
    a.remove()
    // 保存更改到文件  
    sourceFile.saveSync();
    /* let context = new Picker().pick();
    if (context) {
      new Parser(context).parse()
    } */
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
