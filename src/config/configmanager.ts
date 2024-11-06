import { readFileSync } from 'fs';
import path from 'path';
import * as vscode from 'vscode';

/* export function defineConfig(config: AnnotationConfig): AnnotationConfig {
    return config
} */

export class ConfigManager {
    /**
     * 定义配置
     */
    /* public static defineConfig(config: AnnotationConfig) {
        return config
    } */

    /**
     * 加载配置
     */
    public static loadConfig(projectPath: string): AnnotationConfig {
        // 首先尝试加载用户配置
        const projectConfig = ConfigManager.loadProjectConfig(projectPath)
        // 若用户本地配置不存在再加载vscode配置
        const vscodeConfig = ConfigManager.loadVscodeConfig()
        // 返回合并后的配置
        return ConfigManager.mergeConfig(vscodeConfig, projectConfig)
    }
    /**
     * 加载vscode配置
     */
    public static loadVscodeConfig(): AnnotationConfig {
        const vscodeConfig = vscode.workspace.getConfiguration("annotation")
        // 获取全局配置
        const vscodeGlobalConfig: GlobalAnnotationConfig = vscodeConfig.get("globalSetting") || {}
        // 获取方法注解配置
        const vscodeMethodConfig: MethodAnnotationConfig = vscodeConfig.get("methodSetting") || {}
        // 获取类注解配置
        const vscodeClassConfig: ClassAnnotationConfig = vscodeConfig.get("classSetting") || {}
        // 获取属性注解配置
        const vscodePropertyConfig: PropertyAnnotationConfig = vscodeConfig.get("propertySetting") || {}
        // 获取单词映射
        const vscodeWordMaps: WordMaps = vscodeConfig.get("wordMaps") || {}
        // 返回注解配置对象
        return { globalConfig: vscodeGlobalConfig, methodConfig: vscodeMethodConfig, classConfig: vscodeClassConfig, propertyConfig: vscodePropertyConfig, wordMaps: vscodeWordMaps }
    }
    /**
     * 加载用户配置
     */
    public static loadProjectConfig(projectPath: string): AnnotationConfig {
        // 拼接文件路径
        const filePath = path.join(projectPath, 'annotation.config.json')
        // 优先加载用户的ts配置文件
        // 加载用户的js配置文件
        // 加载用户json格式的配置文件
        let annotationConfig: AnnotationConfig;
        const config = readFileSync(filePath)
        annotationConfig = JSON.parse(config.toString())
        return annotationConfig
    }

    /**
     * 合并配置
     */
    public static mergeConfig(vscodeConfig: AnnotationConfig, projectConfig: AnnotationConfig) {
        let globalConfig: GlobalAnnotationConfig = {}
        let classConfig: ClassAnnotationConfig = {}
        let methodConfig: MethodAnnotationConfig = {}
        let propertyConfig: PropertyAnnotationConfig = {}
        let wordMaps: WordMaps = {}
        // 合并用户项目配置和vscode配置
        Object.assign(globalConfig, vscodeConfig.globalConfig, projectConfig.globalConfig)
        Object.assign(classConfig, vscodeConfig.classConfig, projectConfig.classConfig)
        Object.assign(methodConfig, vscodeConfig.methodConfig, projectConfig.methodConfig)
        Object.assign(propertyConfig, vscodeConfig.propertyConfig, projectConfig.propertyConfig)
        Object.assign(wordMaps, vscodeConfig.wordMaps, projectConfig.wordMaps)
        // 返回合并后的配置
        return { globalConfig, classConfig, methodConfig, propertyConfig, wordMaps }
    }
}

export interface GlobalAnnotationConfig {
    // 是否加上作者,填写作者名
    author?: string | null,
    // 是否加上邮箱
    email?: string | null,
    // 是否加上电话
    tel?: string | null,
    // 是否加上描述
    description?: string | null
    // 是否加上时间
    date?: boolean,
    // 是否加上日期时间
    dateTime?: boolean,
    // 用户个性化注解
}
export interface ClassAnnotationConfig extends GlobalAnnotationConfig {
    className?: (className: string) => string
}
export interface MethodAnnotationConfig extends GlobalAnnotationConfig {
    // 参数 可以不开启也可以用户自己指定
    parameters?: boolean | ((parameters: Map<string, string>) => string)
    // 返回值
    returnType?: boolean,
    // 抛出异常
    throwErrors?: boolean | ((throwErrors: Array<string>) => string)
    // 相同异常类型是否合并
    throwMerge?: boolean
}
export interface PropertyAnnotationConfig extends GlobalAnnotationConfig {
    // 类型是否开启
    propertyType?: boolean
}
// 单词映射
export interface WordMaps {
    [key: string]: string
}
export interface AnnotationConfig {
    // 全局配置
    globalConfig?: GlobalAnnotationConfig
    // 类配置
    classConfig?: ClassAnnotationConfig,
    // 方法注解配置
    methodConfig?: MethodAnnotationConfig,
    // 属性配置
    propertyConfig?: PropertyAnnotationConfig
    // 单词映射
    wordMaps?: WordMaps
}
