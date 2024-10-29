
import { PickContext } from "../picker/pickcontext";
import { Annotation, ClassAnnotation, MethodAnnotation, PropertyAnnotation } from "../annotation/annotation";
import { ASTUtil } from "../utils/ASTUtil";
import { ClassInfo, MemberTypeEnum, MethodInfo, PropertyInfo } from "../type";
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
  public parse() {
    // 获取文件路径，读取文件转化为抽象语法树
    const fileName = this.context.getFileName()
    // 获取所点击的单词
    const wordText = this.context.getWordText()
    // 查询单词所对应的属性、方法、类信息
    let member = ASTUtil.getMemberInfo(fileName, wordText)
    if (member) {
      switch (member.memberType) {
        // 属性
        case 0:
          console.log("a");
          new PropertyAnnotation(this.context, <PropertyInfo>member).createAnnotation();
          ; break;
        // 方法
        case 1: console.log("b");
          new MethodAnnotation(this.context, <MethodInfo>member).createAnnotation(); break;
        // 类
        case 2: console.log("c");
          new ClassAnnotation(this.context, <ClassInfo>member).createAnnotation();
          break;
      }
    }
    /*  ASTUtil.collectInfo(ASTUtil.createSourceFile(fileName))
     console.log(ASTUtil.classInfos); */
    // 链式调用
  }
}