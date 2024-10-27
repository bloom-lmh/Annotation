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
   * 解析typescript文件
   * @returns 抽象语法树（AST）
   */
  public parse(fileName: string): TsParser {
    //  同步读取文件
    const fileContent = readFileSync(fileName, "utf-8")
    // 解析文件内容生成抽象语法树
    this.tsFileAST = ts.createSourceFile(fileName, fileContent, ts.ScriptTarget.Latest, true)
    // 链式调用
    return this
  }


  /**
   * 方法匹配正则表达式
   */
  // private methodRegExp = /(?:public|private|protected|static|readonly|abstract)?\s*(?<methodName>\w+)\s*\([^)]*\)\s*:\s*(?<returnType>\w+)?\s*\{?/;
  /**
   * 类匹配正则表达式
   */
  /* private classRegExp = /class\s+(?<className>[A-Z][a-zA-Z0-9]*)/;
 
  public parse(context: PickContext): MethodAnnotation | ClassAnnotation | undefined {
    // 获取拾取的行文本
    let lineText = context.getLineText();
    // 匹配结果
    let result: RegExpMatchArray | null;
    // 方法名
    // 返回值类型
    // 参数与参数类型
    // 类名
    // 抛出的异常及其类型
    // 如果是方法映射为方法注释对象
    if (result = lineText.match(this.methodRegExp)) {
      console.log(result);

      let methodAnnotation = new MethodAnnotation();
      return methodAnnotation;
    } else if (result = lineText.match(this.classRegExp)) {
      console.log(result);
      // 否则映射为类注释对象
      return new ClassAnnotation();
    }
  } */
}