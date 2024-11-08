import { readFileSync } from 'fs';
import path from 'path';
import * as vscode from 'vscode';
import { AnnotationConfig, ClassAnnotationConfig, GlobalAnnotationConfig, MethodAnnotationConfig, PropertyAnnotationConfig, WordMaps } from './configtype';

/* export function defineConfig(config: AnnotationConfig): AnnotationConfig {
    return config
} */

export class ConfigManager {
    /**
     * 全局配置
     */
    public static globalConfig: GlobalAnnotationConfig
    /**
     * 定义配置
     */
    public static defineConfig(config: AnnotationConfig) {
        return config
    }

    /**
     * 加载配置
     */
    public static loadConfig(projectPath: string): AnnotationConfig {
        // 首先尝试加载用户配置
        const projectConfig = ConfigManager.loadProjectConfig(projectPath)
        // 若用户本地配置不存在再加载vscode配置
        const vscodeConfig = ConfigManager.loadVscodeConfig()
        // 合并配置
        let annotationConfig: AnnotationConfig = ConfigManager.mergeConfig(vscodeConfig, projectConfig)
        // 记录全局配置
        ConfigManager.globalConfig = annotationConfig.globalConfig || {}
        // 返回合并后的配置
        return annotationConfig
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
