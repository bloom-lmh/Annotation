import * as vscode from 'vscode';
import { Picker } from './picker/picker';
import { TsFileParser } from './parser/tsFileParser';
import { ConfigManager } from './config/configmanager';
import { AnnotationFactory } from './annotation/annotationfactory';
export function activate(context: vscode.ExtensionContext) {
    //获取项目路径
    const workspaceFolders = vscode.workspace.workspaceFolders;
    // 获取工作区文件失败
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('工作区没有打开的文件！');
        return;
    }
    const projectPath = workspaceFolders[0].uri.fsPath;
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
        const { fileName, wordText, lineNumber } = new Picker(editor).pick()
        // 解析ts文件为语法树
        const sourceFile = TsFileParser.parse(fileName)
        // 获取单词对应的成员信息
        const memberDeclaration = TsFileParser.getMemberInfoByName(sourceFile, wordText, lineNumber);
        // 获取成员失败提示信息
        if (!memberDeclaration) {
            vscode.window.showErrorMessage("获取成员信息失败！");
            return;
        }

        // 加载用户配置
        let annotationConfig = ConfigManager.loadConfig(projectPath)
        // 获取用户配置失败提示信息
        if (!annotationConfig) {
            vscode.window.showErrorMessage("获取用户配置失败！");
            return;
        }
        // 获取注解对象
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


        // 添加 JSDoc 注释  
        // 获取函数声明节点  
        // 添加 JSDoc 注释  
        /* const formatOptions: ts.FormatCodeSettings = {
          indentSize: 2,
          tabSize: 2,
          newLineCharacter: "\n",
          convertTabsToSpaces: true,
        };
        sourceFile.formatText(formatOptions) */
        // 保存更改到文件  
        sourceFile.saveSync();

    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
