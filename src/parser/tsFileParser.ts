import { ClassDeclaration, FunctionDeclaration, MethodDeclaration, Project, ts, PropertyDeclaration, SourceFile } from "ts-morph";
/**
 * ts文件解析器
 */
export class TsFileParser {
    /**
     * 将文件映射为AST
     * @param fileName ts或js文件路径
     * @returns 解析后的文件
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
     * @param sourceFile 解析后的源文件
     * @param memberName 方法名、属性名、类名都可以
     * @param lineNumber 方法、属性、类所在行
     */
    /*  public static getMemberInfoByName(sourceFile: SourceFile, memberName: string, lineNumber: number): ClassDeclaration | MethodDeclaration | PropertyDeclaration | FunctionDeclaration | null {
       // 获取文件中的类
       for (const classMember of sourceFile.getClasses()) {
         // 若类满足条件返回类
         if (classMember.getName() === memberName && classMember.getStartLineNumber() === lineNumber) {
           return classMember
         }
         // 遍历类中的方法，若方法满足条件返回方法
         for (const methodMember of classMember.getMethods()) {
           if (methodMember.getName() === memberName && methodMember.getStartLineNumber() === lineNumber) {
             return methodMember
           }
         }
         // 遍历类中的属性，若属性满足条件返回属性
         for (const propertyMember of classMember.getProperties()) {
           if (propertyMember.getName() === memberName && propertyMember.getStartLineNumber() === lineNumber) {
             return propertyMember
           }
         }
       }
       // 获取文件中方法
       let functionMember = sourceFile.getFunctions().find(functionMember => functionMember.getName() === memberName && functionMember.getStartLineNumber() === lineNumber)
       if (functionMember) {
         return functionMember
       }
       return null
     } */

    /**
     * 获取成员信息
     * @param sourceFile 解析后的源文件
     * @param memberName 方法名、属性名、类名都可以
     * @param lineNumber 方法、属性、类所在行
     */
    /*  public static getMemberInfoByName_v2(sourceFile: SourceFile, memberName: string): ClassDeclaration | MethodDeclaration | PropertyDeclaration | FunctionDeclaration | null {
       // 获取文件中的类
       for (const classMember of sourceFile.getClasses()) {
         // 若类满足条件返回类
         if (classMember.getName() === memberName) {
           return classMember
         }
         // 遍历类中的方法，若方法满足条件返回方法
         for (const methodMember of classMember.getMethods()) {
           if (methodMember.getName() === memberName) {
             return methodMember
           }
         }
         // 遍历类中的属性，若属性满足条件返回属性
         for (const propertyMember of classMember.getProperties()) {
           if (propertyMember.getName() === memberName) {
             return propertyMember
           }
         }
       }
       // 获取文件中方法
       let functionMember = sourceFile.getFunctions().find(functionMember => functionMember.getName() === memberName)
       if (functionMember) {
         return functionMember
       }
       return null
     } */
    /**
     * 获取方法中的参数
     */
    /*  public static getMethodParameters(methodDeclaration: MethodDeclaration | FunctionDeclaration): Map<string, string> {
       let parameters = new Map()
       methodDeclaration.getParameters().forEach(param => {
         return parameters.set(param.getName(), param.getType().getText())
       })
       return parameters
     }
    */
    /**
     * 获取方法中的异常
     */
    /*  public static getMethodThrows(methodDeclaration: MethodDeclaration | FunctionDeclaration): Set<string> {
       let throwRegExp = /\bthrow\s+new\s+(?<errorType>\w+)\s*\(\s*.*?\s*\)\s*;?/
       const throws: Set<string> = new Set()
       // 方法声明
       const methodBody = methodDeclaration.getBody();
       if (methodBody) {
         const throwStatements = methodBody.getDescendantsOfKind(ts.SyntaxKind.ThrowStatement);
         throwStatements.forEach(statement => {
           let res = statement.getText().match(throwRegExp)
           if (res) {
             throws.add(res[1])
           }
         })
       }
       return throws
     } */
}