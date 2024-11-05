import * as vscode from 'vscode';
import { Picker } from './picker/picker';
import { ClassDeclaration, FunctionDeclaration, JSDoc, MethodDeclaration, Project, PropertyDeclaration, ts } from "ts-morph";
import { TsFileParser } from './parser/tsFileParser';
import { ClassAnnotation, MethodAnnotation, PropertyAnnotation } from './annotation/annotation';
import { ConfigLoader } from './config/configloader';
import { WordUtil } from './utils/wordutil';
export function activate(context: vscode.ExtensionContext) {
    //获取项目路径
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder is open.');
        return;
    }
    const projectPath = workspaceFolders[0].uri.fsPath;
    // 读取项目下的配置文件

    const disposable = vscode.commands.registerCommand('addAnnotation', async () => {
        // 获取文本编辑器
        const editor = vscode.window.activeTextEditor;
        // 获取失败提示信息
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
        if (!memberDeclaration) return

        // 加载用户配置
        let { classConfig, globalConfig, methodConfig, propertyConfig, wordMaps } = ConfigLoader.loadConfig(projectPath)

        // 文本处理工具来进行处理
        let translationResult = await WordUtil.handleWord(wordText, wordMaps)

        // 生成注解
        let jsdoc = ''
        if (memberDeclaration instanceof ClassDeclaration) {
            const startRow = memberDeclaration.getStartLineNumber()
            const className = memberDeclaration.getName() || ''
            const isAbstract = memberDeclaration.isAbstract()
            jsdoc = new ClassAnnotation(startRow, className, isAbstract).createAnnotation()
        }
        if (memberDeclaration instanceof MethodDeclaration || memberDeclaration instanceof FunctionDeclaration) {
            const startRow = memberDeclaration.getStartLineNumber()
            const methodName = memberDeclaration.getName() || ''
            const parameters = TsFileParser.getMethodParameters(memberDeclaration)
            const returnType = memberDeclaration.getReturnType().getText()
            const throwErrors = TsFileParser.getMethodThrows(memberDeclaration)
            jsdoc = new MethodAnnotation(startRow, methodName, parameters, returnType, throwErrors).createAnnotation()
        }
        if (memberDeclaration instanceof PropertyDeclaration) {
            const startRow = memberDeclaration.getStartLineNumber()
            const propertyName = memberDeclaration.getName()
            const propertyType = memberDeclaration.getType().getText()
            jsdoc = new PropertyAnnotation(startRow, propertyName, propertyType).createAnnotation()
        }
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
