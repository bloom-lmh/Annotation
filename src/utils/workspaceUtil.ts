import * as vscode from 'vscode';
/**
 * 工作区管理器
 */
export class WorkspaceUtil {
    /**
     * 获取全部项目的路径
     */
    public static getProjectPath(): Array<string> {
        let projectPaths: Array<string> = []
        if (vscode.workspace.workspaceFolders) {
            projectPaths = vscode.workspace.workspaceFolders.map(folder => {
                return folder.uri.fsPath
            })
        }
        return projectPaths
    }
}