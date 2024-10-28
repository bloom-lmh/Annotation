import { readFileSync } from "fs";

import ts from 'typescript'

// 定义一个函数来收集类信息  
interface ClassInfo {
  name: string;
  methods: { name: string, parameters: string[] }[];
  properties: { name: string, type?: string }[];
}

/**
 * 遍历AST树节点的类
 */
export class ASTUtil {
  public static classInfos: ClassInfo[] = [];
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