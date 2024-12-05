import { TsFileManager } from "../parser/tsFileManager";
import { ConfigLoader } from "./configLoader";
import { AnnotationConfig } from "./configType";

/**
 * 配置管理器
 */
export class ConfigManager {
    /**
     * 用户项目配置
     */
    private static projectConfigMap: Map<string, AnnotationConfig> = new Map();

    /**
     * 添加配置
     */
    public static addOrUpdateProjectConfig(projectPath: string, annotationConfig?: AnnotationConfig) {
        if (!annotationConfig) {
            annotationConfig = ConfigLoader.loadConfig(projectPath)
        }
        this.projectConfigMap.set(projectPath, annotationConfig);
    }

    /**
     * 获取配置
     */
    public static getProjectConfig(projectPath: string): AnnotationConfig {
        // 从集合中获取配置
        let annotationConfig = this.projectConfigMap.get(projectPath)
        // 若集合中没有则再进行加载
        if (!annotationConfig) {
            annotationConfig = ConfigLoader.loadConfig(projectPath)
        }
        // 返回配置
        return annotationConfig
    }

    public static removeProjectConfig(projectPath: string) {
        this.projectConfigMap.delete(projectPath)
    }
}