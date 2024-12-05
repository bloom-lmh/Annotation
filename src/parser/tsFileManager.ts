import { SourceFile } from "ts-morph";
import { TsFileParser } from "./tsFileParser";

/**
 * ts文件管理器
 */
export class TsFileManager {
    /**
     * 文件路径与ast语法树的映射
     */
    private static sourceFileMaps: Map<string, SourceFile> = new Map()

    /**
     * 添加ast语法树
     */
    public static addOrUpdateSourceFile(filename: string, sourceFile: SourceFile) {
        // 没有则添加
        this.sourceFileMaps.set(filename, sourceFile)
    }
    /**
     * 获取ast语法树
     */
    public static getSourceFile(fileName: string): SourceFile | undefined {
        return this.sourceFileMaps.get(fileName)
    }

    public static removeSourceFile(fileName: string) {
        this.sourceFileMaps.delete(fileName)
    }
}