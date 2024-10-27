import * as vscode from 'vscode';
import ts from 'typescript'
import { readFileSync } from 'fs';
import { TsParser } from './parser';
/**
 * 1.上一行是其它代码
 * 2.上面已经有注释
 * 3.上一行是空行
 */
enum PreviousStatus {
  Code,
  Annotation,
  Empty,
}
/**
 * 拾取时的上下文环境
 * @description 用于记录拾取的行内容以及行号等信心，方便后续处理
 */
export class PickContext {

  /**
   * 行号
   */
  private lineNumber: number;

  /**
   * 本行文本
   */
  private lineText: string;

  /**
   * 方法或类上方的状态
   */
  private previousStatus: PreviousStatus;

  /**
   * 构造器
   */
  constructor(lineNumber: number, lineText: string, previousStatus?: PreviousStatus) {
    this.lineNumber = lineNumber;
    this.lineText = lineText;
    this.previousStatus = PreviousStatus.Code;
  }

  public getLineNumber(): number {
    return this.lineNumber;
  }

  public getLineText(): string {
    return this.lineText;
  }

  public getPreviousStatus(): PreviousStatus {
    return this.previousStatus;
  }

}
/**
 * 内容拾取器
 * @description 用于拾取内容，并返回上下文对象
 */
export class Picker {
  /**
   * 类正则表达式
   */
  //private classRegExp = /class\s+\w+(?:\s*<[^>]+>)?(?:\s+extends\s+\w+(?:\.<\w+(?:,\s*\w+)*>)?)?\s*\{[\s\S]*?\}/;

  /**
   * 方法正则表达式
   */
  //private methodRegExp = /\b(?:async\s+)?(?:\w+\s+)?(?:public|private|protected|static)?\s+\w+\s*\([^)]*\)\s*(?::[^;]+)?\s*\{?[\s\S]*?\}?/;

  /**
   * 匹配ES6方法的正则表达式
   */
  //private esMethodRegExp = /(?:\b(?:private|public)\s+)?\b\w+\s*=\s*=>\s*(?:\{([\s\S]*?)\}|([\s\S]*?)(?:;|$))/;
  /**
   * 属性正则表达式
   */
  // private attributeRegExp = /a/
  /**
   * 拾取内容
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
    // 获取行号
    const lineNumber = position?.line;
    // 获取本行内容
    const lineText = document.lineAt(lineNumber).text;
    // 若本行为空则什么也不做
    if (!lineText) {
      return;
    } else {
      // 解析所选择的元素
      console.log(position.character);

      // 解析为AST抽象语法树
      new TsParser().parse(fileName);
    }

    // 读取文件
    // 创建AST

    /* editor.edit(editBuilder => {
      editBuilder.insert(position, "aaa");
    }); */
    // 向上查找不为空的行号
    // 向下查找不为空的行号

    // 获取文本行以及后续的内容
    //const behindText = document.getText(new vscode.Range(new vscode.Position(lineNumber, 0), new vscode.Position(lineCount, 0)));
    //console.log(behindText);

    // 若是类，则采取类处理策略
    /* if (this.classRegExp.test(lineText)) {
      console.log("是类");
    } */
    // 若是方法，则采用方法处理策略
    /*  else if (this.methodRegExp.test(lineText) || this.esMethodRegExp.test(lineText)) {
       console.log("是方法");
     }
     console.log(lineNumber); */

    // 返回拾取的内容
    return new PickContext(lineNumber, lineText);
  }

  /**
   * 类拾取策略
   */
  /*  public classPickStrategy(): PickContext {
 
   } */
  /**
   * 方法拾取策略
   */
  //public methodPickStrategy(): PickContext { }

  /**
   * 属性拾取策略
   */
  // public attributePickStrategy(): PickContext { }
}

// 遍历 AST 并打印节点信息（这是一个简单的遍历示例）  


function findMethodNames(node: ts.Node, methodNames: string[] = []): string[] {
  if (ts.isFunctionDeclaration(node)) {
    if (node.name) {
      methodNames.push(node.name.getText());
    }

  } else if (ts.isMethodDeclaration(node)) {
    methodNames.push(node.name.getText());
  } else if (ts.isClassDeclaration(node)) {
    // 对于类声明，我们需要进一步遍历其成员  
    ts.forEachChild(node, childNode => {
      findMethodNames(childNode, methodNames);
    });
  }

  // 递归遍历所有子节点  
  ts.forEachChild(node, childNode => {
    findMethodNames(childNode, methodNames);
  });

  return methodNames;
}  
