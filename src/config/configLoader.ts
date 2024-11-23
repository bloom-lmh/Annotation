import { existsSync, readFileSync } from 'fs';
import path from 'path';
import * as vscode from 'vscode';
import {
    AnnotationConfig, ClassAnnotationConfig,
    GlobalAnnotationConfig, MethodAnnotationConfig, PropertyAnnotationConfig, TranslationConfig
} from './configType';
import { WorkspaceUtil } from '../utils/workspaceUtil';
import { ConfigManager } from './configManager';
/* export function defineConfig(config: AnnotationConfig): AnnotationConfig {
    return config
} */

export class ConfigLoader {
    /**
     * 全局配置
     */
    // public static globalConfig: GlobalAnnotationConfig
    /**
     * 定义配置
     */
    public static defineConfig(config: AnnotationConfig) {
        return config
    }
    /**
      * 加载工作区的全部配置文件
      */
    public static loadWorkspaceConfig() {
        // 获取工作区的全部项目路径
        let projectPaths: Array<string> = WorkspaceUtil.getProjectPath()
        projectPaths.forEach(projectPath => {
            ConfigManager.addProjectConfig(projectPath, this.loadConfig(projectPath))
        })


    }
    /**
     * 加载配置
     */
    public static loadConfig(projectPath: string): AnnotationConfig {
        // 首先尝试加载用户配置
        const projectConfig = this.loadProjectConfig(projectPath)
        // 若用户本地配置不存在再加载vscode配置
        const vscodeConfig = this.loadVscodeConfig()
        // 合并配置
        let annotationConfig: AnnotationConfig = this.mergeConfig(vscodeConfig, projectConfig)
        // 记录全局配置
        // this.globalConfig = annotationConfig.globalConfig || {}
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
        const vscodeTranslationConfig: TranslationConfig = vscodeConfig.get("translationSetting") || {}
        // 返回注解配置对象
        return { globalConfig: vscodeGlobalConfig, methodConfig: vscodeMethodConfig, classConfig: vscodeClassConfig, propertyConfig: vscodePropertyConfig, translationConfig: vscodeTranslationConfig }
    }
    /**
     * 加载用户配置
     */
    public static loadProjectConfig(configPath: string): AnnotationConfig {
        // 拼接文件路径
        const filePath = path.join(configPath, 'annotation.config.json')
        // 优先加载用户的ts配置文件
        // 加载用户的js配置文件
        // 加载用户json格式的配置文件
        let annotationConfig: AnnotationConfig = {};
        if (existsSync(filePath)) {
            const config = readFileSync(filePath)
            annotationConfig = JSON.parse(config.toString())
        }
        return annotationConfig
    }

    /**
     * 合并配置
     */
    public static mergeConfig(vscodeConfig: AnnotationConfig, projectConfig: AnnotationConfig) {
        // 获取默认配置
        const defaultconfig = this.getDefaultConfig()
        // 加载默认配置
        let globalConfig: GlobalAnnotationConfig = {}
        let classConfig: ClassAnnotationConfig = {}
        let methodConfig: MethodAnnotationConfig = {}
        let propertyConfig: PropertyAnnotationConfig = {}
        let translationConfig: TranslationConfig = {}
        // 合并用户项目配置和vscode配置
        Object.assign(globalConfig, defaultconfig.globalConfig, vscodeConfig.globalConfig, projectConfig.globalConfig)
        Object.assign(classConfig, defaultconfig.classConfig, vscodeConfig.classConfig, projectConfig.classConfig)
        Object.assign(methodConfig, defaultconfig.methodConfig, vscodeConfig.methodConfig, projectConfig.methodConfig)
        Object.assign(propertyConfig, defaultconfig.propertyConfig, vscodeConfig.propertyConfig, projectConfig.propertyConfig)
        Object.assign(translationConfig, defaultconfig.translationConfig, vscodeConfig.translationConfig, projectConfig.translationConfig)

        // 返回合并后的配置
        return { globalConfig, classConfig, methodConfig, propertyConfig, translationConfig }
    }


    /**
     * 默认配置
     */
    public static getDefaultConfig() {
        return {
            "globalConfig": {

            },
            "classConfig": {
            },
            "methodConfig": {
                "parameters": true,
                "throwErrors": true,
                "returnType": true,
            },
            "propertyConfig": {
                "propertyType": true
            },
            "translationConfig": {
                "apiKey": ["G3spRPsvd9ZmSSGykVSD", "MqENgg3NeMirAsnEpa4z", "3qDhjpKw5GaCi2HohyFi", "cAirtriojQobuTu9Yre2"],
                "open": true,
                "wordMaps": {
                    "i": "接口"
                }
            }
        }
    }
}
