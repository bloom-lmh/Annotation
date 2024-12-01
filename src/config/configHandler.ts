import * as vscode from 'vscode';
import path, { basename, dirname } from 'path';
import { ConfigManager } from './configManager';

export class ConfigHandler {
    public static handleSave(event: vscode.TextDocument) {
        if (basename(event.fileName) === "annotation.config.json") {
            ConfigManager.addOrUpdateProjectConfig(dirname(event.fileName))
        }
    }
    /**
     * 处理删除配置文件时的操作
     */
    public static handleCreateOrDelete(event: vscode.FileDeleteEvent) {
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

    public static handleRename(event: vscode.FileRenameEvent) {
        event.files.forEach(({ oldUri, newUri }) => {
            // 获取老文件名和新文件名
            const newFileName = basename(newUri.fsPath)
            const oldFileName = basename(oldUri.fsPath)
            if ((oldFileName === 'annotation.config.json' && newFileName !== oldFileName) || newFileName === 'annotation.config.json') {
                ConfigManager.addOrUpdateProjectConfig(dirname(oldUri.fsPath))
            }
        });
    }
}
