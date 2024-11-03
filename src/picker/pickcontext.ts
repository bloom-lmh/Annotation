import * as vscode from 'vscode';

/**
 * 拾取时的上下文环境
 * @description 用于记录拾取的行内容以及行号等信心，方便后续处理
 * @deprecated
 */
export class PickContext {

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
    constructor(fileName: string, lineNumber: number, wordText: string) {
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