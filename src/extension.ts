import * as vscode from 'vscode';
import { ContextPicker } from './picker/contextPicker';
import { TsFileParser } from './parser/tsFileParser';
import { ConfigLoader } from './config/configLoader';
import { AnnotationFactory } from './annotation/annotationFactory';
import { ConfigManager } from './config/configManager';
import { ConfigHandler } from './config/configHandler';
import { TsFileUtil } from './parser/tsFileUtil';
import path, { basename, dirname, extname } from 'path';
import { TsFileManager } from './parser/tsFileManager';
export function activate(context: vscode.ExtensionContext) {
    // 开启监听事件
    /* WorkspaceListener.startListen() */
    vscode.workspace.textDocuments.forEach(doc => {
        // 对已经打开的ts文件进行解析
        // 若文件以ts或js结尾则将其解析为ast语法树
        let fileName = doc.fileName
        let postfix = path.extname(fileName)
        if (postfix === '.ts' || postfix === '.js') {
            // 尝试解析文件
            let sourceFile = TsFileParser.parse(fileName)
            // 建立映射
            TsFileManager.addOrUpdateSourceFile(fileName, sourceFile)
        }
    })
    vscode.workspace.onDidOpenTextDocument(event => {
        let fileName = event.fileName
        let postfix = path.extname(fileName)
        if (postfix === '.ts' || postfix === '.js') {
            // 尝试解析文件
            let sourceFile = TsFileParser.parse(fileName)
            // 建立映射
            TsFileManager.addOrUpdateSourceFile(fileName, sourceFile)
        }
    })
    // 文件保存监听
    vscode.workspace.onDidDeleteFiles(event => {
        // 更新配置文件
        ConfigHandler.handleCreateOrDelete(event)
        // 处理文件删除
        event.files.forEach(uri => {
            console.log(uri.fsPath);
            let fileName = uri.fsPath
            let postfix = path.extname(fileName)
            if (postfix === '.ts' || postfix === '.js') {
                TsFileManager.removeSourceFile(fileName)
            }
        })


    });

    // 监听文件移动（重命名）事件
    vscode.workspace.onDidRenameFiles(event => {
        ConfigHandler.handleRename(event)
        event.files.forEach(({ oldUri, newUri }) => {
            // 获取老文件名和新文件名
            const newFileName = basename(newUri.fsPath)
            const oldFileName = basename(oldUri.fsPath)
            let newFilePostfix = extname(newFileName)
            // 若老文件以ts结尾 但新文件不以ts结尾则删除
            if (newFilePostfix !== '.js' && newFilePostfix !== '.ts') {
                TsFileManager.removeSourceFile(newUri.fsPath)
            } else {
                if (newFileName !== oldFileName) {
                    let oldSourceFile = TsFileManager.getSourceFile(oldUri.fsPath)
                    if (oldSourceFile) {
                        TsFileManager.addOrUpdateSourceFile(newUri.fsPath, oldSourceFile)

                        TsFileManager.removeSourceFile(oldUri.fsPath)
                    }
                }
            }
            // 若老文件以ts结尾 新文件也是，但是新文件和老文件名字不一样则更新
        });

    });
    vscode.workspace.onDidCreateFiles(event => {
        // 更新配置文件
        ConfigHandler.handleCreateOrDelete(event)
    })
    vscode.workspace.onDidSaveTextDocument(event => {
        ConfigHandler.handleSave(event)
        let fileName = event.fileName
        let postfix = path.extname(fileName)
        if (postfix === '.ts' || postfix === '.js') {
            // 重新解析
            let sourceFile = TsFileParser.parse(fileName)
            TsFileManager.addOrUpdateSourceFile(fileName, sourceFile)
        }
    })
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
        //const sourceFile = TsFileParser.parse(fileName)
        const sourceFile = TsFileManager.getSourceFile(fileName)
        // 获文件解析失败提示信息
        if (!sourceFile) {
            vscode.window.showErrorMessage("文件解析失败！");
            return;
        }
        // 获取单词对应的成员信息
        const memberDeclaration = TsFileUtil.getMemberInfoByName(sourceFile, wordText, lineNumber);
        // const memberDeclaration = TsFileParser.getMemberInfoByName_v2(sourceFile, wordText);
        // 获取成员失败提示信息
        if (!memberDeclaration) {
            vscode.window.showErrorMessage("获取成员信息失败！");
            return;
        }
        // 获取文件所属项目路径
        const projectPath = vscode.workspace.getWorkspaceFolder(editor.document.uri)?.uri.fsPath
        // 获取用户配置失败提示信息
        if (!projectPath) {
            vscode.window.showErrorMessage("获取项目路径失败！");
            return;
        }
        // 获取项目配置
        let annotationConfig = ConfigManager.getProjectConfig(projectPath)
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

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
