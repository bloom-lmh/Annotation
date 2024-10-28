import { readFileSync } from "fs";

import ts from 'typescript'
/**
 * TS文件解析器
 */
export class TsParser {
  /**
   * 抽象语法树
   */
  private tsFileAST: ts.SourceFile | undefined

  /**
   * 方法信息 
   */

  /**
   * 解析typescript文件,并构建抽象语法树AST
   * @returns 抽象语法树（AST）
   */
  public buildAST(fileName: string): ts.SourceFile {
    //  同步读取文件
    const fileContent = readFileSync(fileName, "utf-8")
    // 解析文件内容生成抽象语法树
    const tsFileAST = ts.createSourceFile(fileName, fileContent, ts.ScriptTarget.Latest, true)
    // 链式调用
    return tsFileAST
  }
}