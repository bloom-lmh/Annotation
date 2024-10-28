import * as vscode from 'vscode';
import ts from 'typescript'
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
    const pickContext = new PickContext(editor, document, fileName, lineNumber, wordText)
    // 返回拾取上下文对象
    return pickContext;
  }
}



