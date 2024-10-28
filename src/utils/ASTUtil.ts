import { readFileSync } from "fs";

import ts from 'typescript'

// 定义一个函数来收集类信息  
interface ClassInfo {
  name: string;
  methods: { name: string, parameters: string[] }[];
  properties: { name: string, type?: string }[];
}
interface MemberInfo {
  classes: { name: string, isAbstract: boolean }[],
  methods: { name: string, parameters: string[] }[];
  properties: { name: string, type?: string }[];
}
/**
 * 遍历AST树节点的类
 */
export class ASTUtil {
  /**
   * 类信息
   */
  public static classInfos: ClassInfo[] = [];
  /**
   * 定义成员信息数组
   */
  public static memberInfos: MemberInfo[] = []
  /**
   * 获取文件中包括方法、类、参数的成员信息
   * @param fileName 文件名
   */
  public static getMemberInfo(fileName: string) {
    ASTUtil.classInfos = []
    //  同步读取文件
    const fileContent = readFileSync(fileName, "utf-8")
    // 解析文件内容生成抽象语法树
    const tsFileAST: ts.SourceFile = ts.createSourceFile(fileName, fileContent, ts.ScriptTarget.Latest, true)
    // 收集节点信息
    ASTUtil.collectMemberInfo(tsFileAST)
  }
  public static collectMemberInfo(node: ts.Node): void {
    // 若节点是类声明
    if (ts.isClassDeclaration(node)) {
      // 获取类名
      const className = node.name?.getText();
      // 是否抽象类
      const isAbstract = node.modifiers && node.modifiers.some(modifier => modifier.kind === ts.SyntaxKind.AbstractKeyword);
      // 

      /*  const classes: { name: string }[] = []
       const methods: { name: string, parameters: string[] }[] = [];
       const properties: { name: string, type?: string }[] = [];
       // 遍历类中的方法
       node.members.forEach(member => {
         // 若是方法，get set访问器属性
         if (ts.isMethodDeclaration(member) || ts.isGetAccessorDeclaration(member) || ts.isSetAccessorDeclaration(member)) {
           // 获取方法名
           const methodName = member.name.getText();
           // 获取方法参数
           const parameters = member.parameters.map(param => param.name.getText());
           // 获取方法返回值类型
           const type = member.type
           // 收集方法信息
           methods.push({ name: methodName, parameters });
           // 若是属性
         } else if (ts.isPropertyDeclaration(member)) {
           const propertyName = member.name.getText();
           let propertyType: string | undefined;
           if (member.type) {
             const typeChecker = ts.createProgram(['path/to/your/sourceFile.ts'], {}).getTypeChecker();
             propertyType = typeChecker.typeToString(typeChecker.getTypeAtLocation(member.type));
           }
           properties.push({ name: propertyName, type: propertyType });
         }
       });
 
       ASTUtil.classInfos.push({ name: className, methods, properties }); */
    }
    // 方法声明
    if (ts.isMethodDeclaration(node) || ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isConstructorDeclaration(node)) {
      if (!node.name) {
        return
      }
      const methodName = node.name.getText();
      console.log(methodName);
    }
    // 属性声明
    if (ts.isPropertyDeclaration(node)) {
      if (!node.name) {
        return
      }
      const propertyName = node.name.getText();
      console.log(propertyName);
    }
    // 递归遍历子节点  
    ts.forEachChild(node, ASTUtil.collectMemberInfo);
  }
  /**
   * 读取文件生成语法树
   */
  public static createSourceFile(fileName: string): ts.SourceFile {
    //  同步读取文件
    const fileContent = readFileSync(fileName, "utf-8")
    // 解析文件内容生成抽象语法树
    const tsFileAST: ts.SourceFile = ts.createSourceFile(fileName, fileContent, ts.ScriptTarget.Latest, true)
    // 返回语法树
    return tsFileAST
  }

  // 遍历 AST 的访问者函数  
  public static collectInfo(node: ts.Node): void {
    // 若节点是类声明
    if (ts.isClassDeclaration(node)) {
      if (!node.name) {
        return
      }
      const className = node.name.getText();
      const methods: { name: string, parameters: string[] }[] = [];
      const properties: { name: string, type?: string }[] = [];

      node.members.forEach(member => {
        if (ts.isMethodDeclaration(member) || ts.isGetAccessorDeclaration(member) || ts.isSetAccessorDeclaration(member)) {
          const methodName = member.name.getText();
          const parameters = member.parameters.map(param => param.name.getText());
          methods.push({ name: methodName, parameters });
        } else if (ts.isPropertyDeclaration(member)) {
          const propertyName = member.name.getText();
          let propertyType: string | undefined;
          if (member.type) {
            const typeChecker = ts.createProgram(['path/to/your/sourceFile.ts'], {}).getTypeChecker();
            propertyType = typeChecker.typeToString(typeChecker.getTypeAtLocation(member.type));
          }
          properties.push({ name: propertyName, type: propertyType });
        }
      });

      ASTUtil.classInfos.push({ name: className, methods, properties });
    }

    // 递归遍历子节点  
    ts.forEachChild(node, ASTUtil.collectInfo);
  }

}