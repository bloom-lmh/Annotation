import * as vscode from 'vscode';
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
   * 编辑器对象
   */
  private editor: vscode.TextEditor | undefined
  /**
   * 文档对象
   */
  private document: vscode.TextDocument | undefined

  /**
   * 文件名
   */
  private fileName: string | undefined

  /**
   * 
   */
  /**
   * 行号
   */
  private lineNumber: number;


  /**
   * 选中单词
   */


  /**
   * 构造器
   */
  constructor(lineNumber: number, lineText: string,) {
    this.lineNumber = lineNumber;
    this.lineText = lineText;
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