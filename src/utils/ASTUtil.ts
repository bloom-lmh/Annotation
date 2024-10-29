import { readFileSync } from "fs";

import ts from 'typescript'

// 定义一个函数来收集类信息  
interface ClassInfo {
  name: string;
  methods: { name: string, parameters: string[] }[];
  properties: { name: string, type?: string }[];
}
interface MemberInfo {
  classes: { className: string, isAbstract: boolean }[],
  methods: { methodName: string, parameters: Map<string, string>[], returnType: string, throwError: string }[];
  properties: { propertyName: string, propertyType?: string }[];
}
/**
 * 遍历AST树节点的类
 */
export class ASTUtil {
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
  public static getMemberInfo(fileName: string) {
    ASTUtil.memberInfos = {
      classes: [],
      methods: [],
      properties: []
    }
    //  同步读取文件
    const fileContent = readFileSync(fileName, "utf-8")
    // 解析文件内容生成抽象语法树
    const tsFileAST: ts.SourceFile = ts.createSourceFile(fileName, fileContent, ts.ScriptTarget.Latest, true)
    // 收集节点信息
    ASTUtil.collectMemberInfo(tsFileAST)
  }
  /**
   * 收集成员信息
   */
  public static collectMemberInfo(node: ts.Node): void {
    // 若节点是类声明
    if (ts.isClassDeclaration(node)) {
      if (!node.name) return
      // 获取类名
      const className = node.name.getText();
      // 是否抽象类
      const isAbstract = node.modifiers && node.modifiers.some(modifier => modifier.kind === ts.SyntaxKind.AbstractKeyword) || false;
      // 记录类信息
      ASTUtil.memberInfos.classes.push({ className, isAbstract: isAbstract })
    }
    // 方法声明
    if (ts.isMethodDeclaration(node) || ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isConstructorDeclaration(node)) {
      // 方法名
      const methodName = node.name?.getText() || 'undefined';
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
      ASTUtil.memberInfos.methods.push({ methodName, parameters, returnType, throwError })
    }
    // 属性声明
    if (ts.isPropertyDeclaration(node)) {
      // 属性名
      const propertyName = node.name.getText();
      // 属性类型
      const propertyType = node.type?.getText();
      // 收集属性
      ASTUtil.memberInfos.properties.push({ propertyName, propertyType });
    }
    // 递归遍历子节点  
    ts.forEachChild(node, ASTUtil.collectMemberInfo);
  }
}