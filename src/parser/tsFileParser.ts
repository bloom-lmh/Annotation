import { ClassDeclaration, FunctionDeclaration, MethodDeclaration, Project, ts, PropertyDeclaration, SourceFile } from "ts-morph";
/**
 * ts文件解析器
 */
export class TsFileParser {
  /**
   * 将文件映射为AST
   * @param fileName ts或js文件路径
   */
  public static parse(fileName: string): SourceFile {
    // 创建一个新的项目实例  
    const project = new Project();
    // 打开或创建一个 TypeScript 文件  
    const sourceFile = project.addSourceFileAtPath(fileName);
    // 返回源文件
    return sourceFile
  }
  /**
   * 获取成员信息
   */
  public static getMemberInfoByName(sourceFile: SourceFile, memberName: string, lineNumber: number): ClassDeclaration | MethodDeclaration | PropertyDeclaration | FunctionDeclaration | null {
    // 获取文件中的类
    for (const classMember of sourceFile.getClasses()) {
      // console.log(classMember.getName(), memberName, classMember.getStartLineNumber(), lineNumber);
      // 若类满足条件返回类
      if (classMember.getName() === memberName && classMember.getStartLineNumber() === lineNumber) {
        return classMember
      }
      for (const methodMember of classMember.getMethods()) {
        if (methodMember.getName() === memberName && methodMember.getStartLineNumber() === lineNumber) {
          //console.log(methodMember.getName());
          return methodMember
        }
      }
      for (const propertyMember of classMember.getProperties()) {
        if (propertyMember.getName() === memberName && propertyMember.getStartLineNumber() === lineNumber) {
          // console.log(propertyMember.getName());
          return propertyMember
        }
      }
    }
    // 获取文件中方法
    let functionMember = sourceFile.getFunctions().find(functionMember => functionMember.getName() === memberName && functionMember.getStartLineNumber() === lineNumber)
    if (functionMember) {
      // console.log(functionMember.getName());
      return functionMember
    }
    return null
  }

  /**
   * 获取方法中的参数
   */
  public static getMethodParameters(methodDeclaration: MethodDeclaration): Map<string, string>[] {
    return methodDeclaration.getParameters().map(param => {
      return new Map().set(param.getName(), param.getType().getText())
    })
  }

  /**
   * 获取方法中的异常
   */
  public static getMethodThrows(methodDeclaration: MethodDeclaration) {
    // 获取方法体的 AST 节点  
    const methodBody = methodDeclaration.getStatements();
    if (methodBody) {
      methodBody.forEach(statement => {
        /* if (ts.isThrowStatement(statement)) {
          // 找到了 throw 语句  
          console.log("Found throw statement:", statement.getText());

          // 你可以进一步分析 throw 语句中的表达式  
          const throwExpression = statement.getExpression();
          if (ts.isNewExpression(throwExpression)) {
            // 如果是 new Expression（例如 new Error(...)）  
            console.log("Thrown object:", throwExpression.getText());
          }
        } */
      });
    }
  }
}