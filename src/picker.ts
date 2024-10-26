import * as vscode from 'vscode';
/**
 * 拾取时的上下文环境
 */
export class PickContext {
  private lineText: string
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
    // 获取内容
    const lineText = document.lineAt(lineNumber).text;
    // 返回拾取的内容
    return { position, lineNumber, lineText };
  }
}