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
}