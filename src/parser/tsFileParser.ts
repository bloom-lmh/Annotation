import { ClassDeclaration, FunctionDeclaration, MethodDeclaration, Project, PropertyDeclaration, SourceFile } from "ts-morph";
/**
 * ts文件解析器
 */
export class TsFileParser {
  /**
   * 将文件映射为AST
   * @param fileName ts或js文件路径
   */
  public parse(fileName: string): SourceFile {
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
  public getMemberInfoByName(sourceFile: SourceFile, memberName: string, lineNumber: number): ClassDeclaration | MethodDeclaration | PropertyDeclaration | FunctionDeclaration | null {
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
}