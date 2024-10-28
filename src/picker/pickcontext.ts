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
  private editor: vscode.TextEditor
  /**
   * 文档对象
   */
  private document: vscode.TextDocument

  /**
   * 文件名
   */
  private fileName: string
  /**
    * 行号
    */
  private lineNumber: number;
  /**
   * 选中单词
   */
  private wordText: string

  /**
   * 构造器
   */
  constructor(editor: vscode.TextEditor, document: vscode.TextDocument, fileName: string, lineNumber: number, wordText: string) {
    this.editor = editor
    this.document = document
    this.fileName = fileName
    this.lineNumber = lineNumber
    this.wordText = wordText
  }

  public getLineNumber(): number {
    return this.lineNumber;
  }
  public getFileName(): string {
    return this.fileName
  }
  public getWordText(): string {
    return this.wordText
  }
}