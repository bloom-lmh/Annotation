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
   * 行号
   */
  private lineNumber: number;
  /**
   * 本行文本
   */
  private lineText: string;
  /**
   * b
   */
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
    // 获取文本编辑器中的文档
    const document = editor.document;
    // 获取编辑器中光标激活的位置
    const position = editor.selection.active;
    // 获取行号
    const lineNumber = position?.line;
    // 获取本行内容
    const lineText = document.lineAt(lineNumber).text;
    // 获取本行及其后续全部内容
    // 计算当前行之后的文本范围  


    // 先前状态
    let previousStatus: PreviousStatus;
    // 获取上一行
    const previousLine = document.lineAt(lineNumber - 1);






    // 若上一行为空则设置上一行为空状态
    if (previousLine.isEmptyOrWhitespace) {
      previousStatus = PreviousStatus.Empty;
    }
    // 上方是代码
    // 上方是注释

    // 返回拾取的内容
    return new PickContext(lineNumber, lineText);
  }


}