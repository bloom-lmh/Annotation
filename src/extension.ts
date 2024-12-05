import * as vscode from 'vscode';
import { ContextPicker } from './picker/contextPicker';
import { TsFileParser } from './parser/tsFileParser';
import { ConfigLoader } from './config/configLoader';
import { AnnotationFactory } from './annotation/annotationFactory';
import { ConfigManager } from './config/configManager';
import { TsFileUtil } from './parser/tsFileUtil';
import path, { basename, dirname, extname } from 'path';
import { TsFileManager } from './parser/tsFileManager';
export function activate(context: vscode.ExtensionContext) {
    // 对已经打开的文件预加载抽象语法树
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
    // 对打开的文件预加载为抽象语法树
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
    // 删除文件时的对配置文件和抽象语法树的处理
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
                ConfigManager.removeProjectConfig(projectPath)
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
            if (oldFileName === 'annotation.config.json') {
                if (newFileName !== oldFileName) {
                    ConfigManager.removeProjectConfig(dirname(oldUri.fsPath))
                }
            } else {
                if (newFileName === 'annotation.config.json') {
                    ConfigManager.addOrUpdateProjectConfig(dirname(oldUri.fsPath))
                }
            }
            // 若是ts文件则处理
            if (oldFilePostfix === '.ts' || oldFilePostfix === '.js') {
                // 若新老文件名不同
                if (newFileName !== oldFileName) {
                    // 后缀发生变化则删除
                    if (newFilePostfix !== '.js' && newFilePostfix !== '.ts') {
                        TsFileManager.removeSourceFile(oldUri.fsPath)
                        // 仅仅名字发生变化则更新
                    } else {
                        TsFileManager.removeSourceFile(oldUri.fsPath)
                        let sourceFile = TsFileParser.parse(newUri.fsPath)
                        TsFileManager.addOrUpdateSourceFile(newUri.fsPath, sourceFile)
                    }
                }
            }
        });

    });
    // 监听创建文件  注意要在项目根目录下
    vscode.workspace.onDidCreateFiles(event => {
        // 获取工作区文件夹（项目根路径）
        let workspaceFolder
        let projectPath
        // 更新配置文件
        event.files.forEach(uri => {
            workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
            // 获取项目的根路径
            projectPath = workspaceFolder?.uri.fsPath
            // 若项目根路径等于配置文件目录，则表示配置文件时根目录下
            if (projectPath === dirname(uri.fsPath) && basename(uri.fsPath) === "annotation.config.json") {
                ConfigManager.addOrUpdateProjectConfig(projectPath)
            }
        })
    })
    // 保存文件时的回调 注意要保存项目根目录下的文件
    vscode.workspace.onDidSaveTextDocument(event => {
        // 获取文件路径
        let fileName = event.fileName
        // 获取文件后缀
        let postfix = path.extname(fileName)
        // 获取文件的目录
        let filePath = dirname(fileName)
        // 获取工作区文件夹（项目根路径）
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(event.uri);
        const projectPath = workspaceFolder?.uri.fsPath
        // 只对根目录下的配置文件进行处理
        if (projectPath === filePath && basename(fileName) === "annotation.config.json") {
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
        const sourceFile = TsFileManager.getSourceFile(fileName)
        // 获文件解析失败提示信息
        if (!sourceFile) {
            vscode.window.showErrorMessage("文件解析失败,请确保为ts或js文件！");
            return;
        }
        // 获取单词对应的成员信息
        const memberDeclaration = TsFileUtil.getMemberInfoByName(sourceFile, wordText, lineNumber);
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
