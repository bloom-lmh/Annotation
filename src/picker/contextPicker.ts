import * as vscode from 'vscode';

/**
 * 内容拾取器
 * @description 用于拾取内容，并返回上下文对象
 */
export class ContextPicker {
    /**
     * 文本编辑器
     */
    private editor: vscode.TextEditor
    /**
     * 
     * @param editor 编辑器对象
     */
    constructor(editor: vscode.TextEditor) {
        // 编辑器
        this.editor = editor
    }


    /**
     * 拾取光标对应的单词
     */
    public pickCursorWordText(): string {
        // 获取光标位置对象
        const position = this.editor.selection.active;
        // 获取光标所在单词的范围  
        const wordRange = this.editor.document.getWordRangeAtPosition(position);
        // 获取光标所在单词的文本  
        const wordText = this.editor.document.getText(wordRange);
        // 返回单词
        return wordText
    }
    /**
   * 拾取文件名
   */
    public pickFileName() {
        return this.editor.document.fileName
    }
    /**
     * 拾取行号
     */
    public pickLineNumber() {
        // 获取光标位置对象
        const position = this.editor.selection.active;
        // 获取行号
        const lineNumber = position?.line;
        // 返回光标行号
        return lineNumber + 1
    }
    /**
     * 拾取并返回拾取信息上下文
     */
    public pick(): PickContext {
        // 获取拾取的文件路径
        const fileName = this.pickFileName()
        // 获取光标所在单词的文本  
        const wordText = this.pickCursorWordText()
        // 获取行号
        const lineNumber = this.pickLineNumber()
        // 返回拾取上下文对象
        return { fileName, wordText, lineNumber };
    }
}



export interface PickContext {
    /**
     * 文件名
     */
    fileName: string
    /**
     * 行号
     */
    lineNumber: number;
    /**
     * 选中单词
     */
    wordText: string
}