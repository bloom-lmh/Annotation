import * as vscode from 'vscode';
import { ContextPicker } from './picker/contextPicker';
import { TsFileParser } from './parser/tsFileParser';
import { ConfigLoader } from './config/configLoader';
import { AnnotationFactory } from './annotation/annotationFactory';
import { TsFileManager } from './parser/tsFileManager';
export function activate(context: vscode.ExtensionContext) {
    //获取项目路径
    const workspaceFolders = vscode.workspace.workspaceFolders;
    // 获取工作区文件失败
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('工作区没有打开的文件！');
        return;
    }
    const projectPath = workspaceFolders[0].uri.fsPath;

    console.log(projectPath);

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
        // 从管理器中获取文件
        // const sourceFile = TsFileManager.getSourceFile(fileName)
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
        // 加载用户配置
        let annotationConfig = ConfigLoader.loadConfig(projectPath)
        //console.log(annotationConfig);
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
    // 文件打开就进行ast语法树的预解析
    vscode.workspace.onDidOpenTextDocument(event => {
        const fileName = event.fileName
        const sourceFile = TsFileParser.parse(fileName)
        console.log(fileName);
        TsFileManager.addSourceFile(fileName, sourceFile)
    });
    // 文件保存，对比新旧文件进行更新
    vscode.workspace.onDidSaveTextDocument(event => {
        console.log("asad");
    })

    // 文件
    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
