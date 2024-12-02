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
        // 文件路径
        let fileName: string = ''
        // 文件后缀
        let postfix: string = ''
        // 项目路径
        let projectPath: string = ''
        // 处理文件删除
        event.files.forEach(uri => {
            // 获取文件名
            fileName = uri.fsPath
            // 获取文件后缀
            postfix = path.extname(fileName)
            // 若删除的文件是配置文件（有bug）
            if (path.basename(fileName) === "annotation.config.json") {
                // 获取项目路径
                projectPath = dirname(uri.fsPath)
                // 删除该项目下的配置文件
                ConfigManager.addOrUpdateProjectConfig(projectPath)
            }
            // 若是ts或js文件则删除器对应的抽象语法树
            else if (postfix === '.ts' || postfix === '.js') {
                TsFileManager.removeSourceFile(fileName)
            }
        })
    });

    // 监听文件移动（重命名）事件
    vscode.workspace.onDidRenameFiles(event => {
        event.files.forEach(({ oldUri, newUri }) => {
            // 新文件名
            const newFileName = basename(newUri.fsPath)
            // 老文件名
            const oldFileName = basename(oldUri.fsPath)
            // 老文件后缀
            const oldFilePostfix = extname(oldFileName)
            // 新文件后缀
            const newFilePostfix = extname(newFileName)
            // 处理配置文件重命名
            if ((oldFileName === 'annotation.config.json' && newFileName !== oldFileName) || newFileName === 'annotation.config.json') {
                ConfigManager.addOrUpdateProjectConfig(dirname(oldUri.fsPath))
            }
            // 若是ts文件则处理
            if (oldFilePostfix === '.ts' || oldFilePostfix === '.js') {
                // 若新老文件名不同
                if (newFileName !== oldFileName) {
                    // 后缀发生变化则删除
                    if (newFilePostfix !== '.js' || newFileName !== '.ts') {
                        TsFileManager.removeSourceFile(newUri.fsPath)
                        // 仅仅名字发生变化则更新
                    } else {
                        let oldSourceFile = TsFileManager.getSourceFile(oldUri.fsPath)
                        if (oldSourceFile) {
                            console.log("a");

                            TsFileManager.addOrUpdateSourceFile(newUri.fsPath, oldSourceFile)
                            TsFileManager.removeSourceFile(oldUri.fsPath)
                        }
                    }
                }
            }
        });

    });
    vscode.workspace.onDidCreateFiles(event => {
        // 更新配置文件
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
    })
    vscode.workspace.onDidSaveTextDocument(event => {
        // 获取文件路径
        let fileName = event.fileName
        // 获取文件后缀
        let postfix = path.extname(fileName)
        // 若是配置文件
        if (basename(fileName) === "annotation.config.json") {
            ConfigManager.addOrUpdateProjectConfig(dirname(event.fileName))
        }
        // 若是ts文件
        else if (postfix === '.ts' || postfix === '.js') {
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
        ConfigManager.print()
        TsFileManager.print()
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
