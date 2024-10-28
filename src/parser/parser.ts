
import { PickContext } from "../picker/pickcontext";
import { Annotation, MethodAnnotation } from "../annotation/annotation";
import { ASTUtil } from "../utils/ASTUtil";
/**
 * TS文件解析器
 */
export class Parser {
  /**
   * 上下文对象
   */
  private context: PickContext

  /**
   * 构造器
   * @param context 上下文对象
   */
  constructor(context: PickContext) {
    this.context = context
  }

  /**
   * 创建解析注释对象
   * @returns 抽象语法树（AST）
   */
  public parse(): Annotation {
    // 获取文件路径，读取文件转化为抽象语法树
    const fileName = this.context.getFileName()
    // 获取所点击的单词
    const wordText = this.context.getWordText()
    // 查询单词所对应的属性、方法、类信息
    ASTUtil.collectInfo(ASTUtil.createSourceFile(fileName))
    console.log(ASTUtil.classInfos);
    // 链式调用
    return new MethodAnnotation()
  }
}