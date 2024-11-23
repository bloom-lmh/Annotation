import * as vscode from 'vscode';
import { ContextPicker } from './picker/contextPicker';
import { TsFileParser } from './parser/tsFileParser';
import { ConfigLoader } from './config/configLoader';
import { AnnotationFactory } from './annotation/annotationFactory';
import { ConfigManager } from './config/configManager';
export function activate(context: vscode.ExtensionContext) {
    /*  //获取项目路径
     const workspaceFolders = vscode.workspace.workspaceFolders;
     // 获取工作区文件失败
     if (!workspaceFolders) {
         vscode.window.showErrorMessage('工作区没有打开的文件！');
         return;
     } */
    // 加载工作区全部配置文件
    ConfigLoader.loadWorkspaceConfig()
    // 注册命令
    const disposable = vscode.commands.registerCommand('addAnnotation', async () => {
        // 获取文本编辑器
        const editor = vscode.window.activeTextEditor;
        // 获取文本编辑器失败提示信息
        if (!editor) {
            vscode.window.showErrorMessage("需选择类或方法代码");
            return;
        }
        // 创建拾取器对象拾取光标所在单词和文件名以及行号
        const { fileName, wordText, lineNumber } = new ContextPicker(editor).pick()
        // 解析ts文件为语法树
        const sourceFile = TsFileParser.parse(fileName)
        // 获文件解析失败提示信息
        if (!sourceFile) {
            vscode.window.showErrorMessage("文件解析失败！");
            return;
        }
        // 获取单词对应的成员信息
        const memberDeclaration = TsFileParser.getMemberInfoByName(sourceFile, wordText, lineNumber);
        // const memberDeclaration = TsFileParser.getMemberInfoByName_v2(sourceFile, wordText);
        // 获取成员失败提示信息
        if (!memberDeclaration) {
            vscode.window.showErrorMessage("获取成员信息失败！");
            return;
        }
        // 获取文件所属项目路径
        const folderPath = vscode.workspace.getWorkspaceFolder(editor.document.uri)?.uri.fsPath
        // 获取用户配置失败提示信息
        if (!folderPath) {
            vscode.window.showErrorMessage("获取项目路径失败！");
            return;
        }
        // 获取项目配置
        let annotationConfig = ConfigManager.getProjectConfig(folderPath)
        // let annotationConfig = ConfigLoader.loadConfig(projectPath)
        // 获取用户配置失败提示信息
        if (!annotationConfig) {
            vscode.window.showErrorMessage("获取用户配置失败！");
            return;
        }
        // 传入配置和成员信息获取注解对象
        const annotation = await AnnotationFactory.getAnnotation(memberDeclaration, annotationConfig)
        // 注解生成失败提示信息
        if (!annotation) {
            vscode.window.showErrorMessage("注解生成失败！");
            return;
        }
        // 注解对象生成注解
        let jsdoc = annotation.createAnnotation()
        // 添加注解
        let a = memberDeclaration.addJsDoc(jsdoc)
        /* {
           description: "\naaa",
           kind: 24,
           tags: [
               { kind: 25, tagName: 'param', text: '{string} name' },
               { kind: 25, tagName: 'param', text: '{number} age' }
           ]
       } */
        // 保存更改到文件  
        sourceFile.saveSync();
    });
    // 文件保存监听
    // 文件变动监听
    // 更新配置文件
    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
