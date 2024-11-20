import { SourceFile } from "ts-morph";

/**
 * 文件管理器
 */
export class TsFileManager {
    /**
     * 文件路径与ast语法树的映射
     */
    private static sourceFileMaps: Map<string, SourceFile> = new Map()

    /**
     * 添加ast语法树
     */
    public static addSourceFile(filename: string, sourceFile: SourceFile) {
        // 没有则添加
        if (!this.sourceFileMaps.has(filename)) {
            this.sourceFileMaps.set(filename, sourceFile)
        }
    }
    /**
     * 获取ast语法树
     */
    public static getSourceFile(fileName: string): SourceFile | undefined {
        return this.sourceFileMaps.get(fileName)
    }
}