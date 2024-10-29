import { readFileSync } from "fs";
// import {MemberTypeEnum,BaseInfo,ClassInfo ,MethodInfo,PropertyInfo,MemberInfo} from '../type'
import ts from 'typescript'

// 成员类型
enum MemberTypeEnum {
  PROP,
  METHOD,
  CLASS
}
interface BaseInfo {
  memberType: MemberTypeEnum, startRow: number, name: string
}
interface ClassInfo extends BaseInfo {
  isAbstract: boolean
}
interface MethodInfo extends BaseInfo {
  parameters: Map<string, string>[], returnType: string, throwError: string
}
interface PropertyInfo extends BaseInfo {
  propertyType?: string
}
interface MemberInfo {
  classes: ClassInfo[],
  methods: MethodInfo[];
  properties: PropertyInfo[];
}
/**
 * 遍历AST树节点的类
 */
export class ASTUtil {
  /**
   * 文件抽象语法树
   */
  private static tsFileAST: ts.SourceFile

  /**
   * 定义成员信息数组
   */
  public static memberInfos: MemberInfo = {
    classes: [],
    methods: [],
    properties: []
  }
  /**
   * 获取文件中包括方法、类、参数的成员信息
   * @param fileName 文件名
   */
  public static getMemberInfo(fileName: string, memberName: string): MethodInfo | PropertyInfo | ClassInfo | null {
    // 清空成员信息
    ASTUtil.memberInfos = {
      classes: [],
      methods: [],
      properties: []
    }
    //  同步读取文件
    const fileContent = readFileSync(fileName, "utf-8")
    // 解析文件内容生成抽象语法树
    const tsFileAST: ts.SourceFile = ts.createSourceFile(fileName, fileContent, ts.ScriptTarget.Latest, true)
    // 记录tsFileAST
    ASTUtil.tsFileAST = tsFileAST
    // 收集节点信息
    ASTUtil.collectMemberInfo(tsFileAST)
    console.log(ASTUtil.memberInfos);

    // 成员信息
    let memberInfo = null
    // 获取成员信息并返回
    ASTUtil.memberInfos.classes.some(member => {
      if (member.name === memberName) {
        memberInfo = member
        return true
      }
    });
    ASTUtil.memberInfos.methods.some(member => {
      if (member.name === memberName) {
        memberInfo = member
        return true
      }
    });
    ASTUtil.memberInfos.properties.some(member => {
      if (member.name === memberName) {
        memberInfo = member
        return true
      }
    });
    return memberInfo
  }
  /**
   * 收集成员信息
   */
  public static collectMemberInfo(node: ts.Node): void {
    // 获取方法开始所在行
    const startRow = ASTUtil.tsFileAST.getLineAndCharacterOfPosition(node.getStart()).line + 1
    // 若节点是类声明
    if (ts.isClassDeclaration(node)) {
      if (!node.name) return
      // 获取类名
      const className = node.name.getText();
      // 是否抽象类
      const isAbstract = node.modifiers && node.modifiers.some(modifier => modifier.kind === ts.SyntaxKind.AbstractKeyword) || false;
      // 记录类信息
      ASTUtil.memberInfos.classes.push({ memberType: MemberTypeEnum.CLASS, startRow, name: className, isAbstract })
    }
    // 方法声明
    if (ts.isMethodDeclaration(node) || ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isConstructorDeclaration(node)) {
      if (!node.name) return


      // 方法名
      const methodName = node.name.getText();
      // 方法参数
      const parameters = node.parameters.map(param => {
        let key = param.name.getText()
        let value = param.type?.getText() || ''
        let paramMap = new Map<string, string>()
        paramMap.set(key, value)
        return paramMap
      });
      // 方法返回值类型
      const returnType = node.type?.getText() || 'null'
      // 方法抛出的异常
      let throwError = ''
      // 遍历方法体获取异常
      const methodBody = node.body
      if (methodBody) {
        ts.forEachChild(methodBody, childNode => {
          if (ts.isThrowStatement(childNode)) {
            const thrownExpression = childNode.expression;
            if (ts.isLiteralExpression(thrownExpression)) {
              throwError = thrownExpression.getText()
            } else if (ts.isNewExpression(thrownExpression)) {
              throwError = thrownExpression.expression.getText()
            }
          }
        });
      }
      // 收集方法信息
      ASTUtil.memberInfos.methods.push({ memberType: MemberTypeEnum.METHOD, startRow, name: methodName, parameters, returnType, throwError })
    }
    // 属性声明
    if (ts.isPropertyDeclaration(node)) {
      if (!node.name) return
      // 属性名
      const propertyName = node.name.getText();
      // 属性类型
      const propertyType = node.type?.getText();
      // 收集属性
      ASTUtil.memberInfos.properties.push({ memberType: MemberTypeEnum.PROP, startRow, name: propertyName, propertyType });
    }
    // 递归遍历子节点  
    ts.forEachChild(node, ASTUtil.collectMemberInfo);
  }
}