import * as vscode from 'vscode';
import ts from 'typescript'
import { TsParser } from '../parser/parser';
import { PickContext } from './pickcontext';

/**
 * 内容拾取器
 * @description 用于拾取内容，并返回上下文对象
 */
export class Picker {

  /**
   * 拾取并返回拾取信息上下文
   */
  public pick() {
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
    // 获取光标位置对象
    const position = editor.selection.active;
    // 获取光标所在单词的范围  
    const wordRange = editor.document.getWordRangeAtPosition(position);
    // 若不存在则什么都不做然后返回
    if (!wordRange) {
      return;
    }
    // 获取光标所在单词的文本  
    const wordText = editor.document.getText(wordRange);
    // 获取行号
    const lineNumber = position?.line;
    // 获取本行内容
    const lineText = document.lineAt(lineNumber).text;
    // 记录拾取信息
    const pickContext = new PickContext(lineNumber, lineText,)
    // 解析为AST抽象语法树
    /*  const tsFileAST: ts.SourceFile = new TsParser().buildAST(fileName); */
    // 遍历语法树获取类、方法、属性的信息
    /*  visit(tsFileAST) */


    // 返回拾取上下文对象
    return new PickContext(lineNumber, lineText);
  }

}



/* function visit(node: ts.Node): void {
  // 遍历类
  if (ts.isClassDeclaration(node)) {

    if (node.name) {
      console.log(`Class name: ${node.name.getText()}`);
    }

    // 遍历类的成员  
    node.members.forEach(member => {
      // 收集方法信息
      if (ts.isMethodDeclaration(member)) {
        console.log(member.type?.getText());

      }
      // 收集属性信息
      if (ts.isPropertyDeclaration(member)) {

      }
    });
  }
  // 你还可以添加对其他类型节点的处理，比如函数声明、接口等  

  // 递归遍历子节点  
  ts.forEachChild(node, visit);
}  
 */