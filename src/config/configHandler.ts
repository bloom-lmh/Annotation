import * as vscode from 'vscode';
import path, { dirname } from 'path';
import { ConfigManager } from './configManager';
/**
 * 配置处理器
 */
export class ConfigHandler {
    /**
     * 处理删除配置文件时的操作
     */
    public static handleChange(event: vscode.FileDeleteEvent) {
        let projectPath = ''
        // 获取文件结尾
        let change = event.files.some(uri => {
            if (path.basename(uri.fsPath) === "annotation.config.json") {
                projectPath = dirname(uri.fsPath)
                return true
            }
        })
        // 若配置文件删除则重新加载配置
        if (change) {
            // 重新加载配置
            ConfigManager.addOrUpdateProjectConfig(projectPath)
        }
    }
}
