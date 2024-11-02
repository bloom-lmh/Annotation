import * as vscode from 'vscode';
import { Picker } from './picker/picker';
import { ClassDeclaration, FunctionDeclaration, JSDoc, MethodDeclaration, Project, PropertyDeclaration, ts } from "ts-morph";
import { TsFileParser } from './parser/tsFileParser';
import { ClassAnnotation, MethodAnnotation, PropertyAnnotation } from './annotation/annotation';
let m = new Map()
export function activate(context: vscode.ExtensionContext) {

    const disposable = vscode.commands.registerCommand('addAnnotation', () => {
        // 获取文本编辑器
        const editor = vscode.window.activeTextEditor;
        // 获取失败提示信息
        if (!editor) {
            vscode.window.showErrorMessage("需选择类或方法代码");
            return;
        }
        // 创建拾取器对象拾取光标所在单词和文件名以及行号
        const picker = new Picker(editor)
        const fileName = picker.pickFileName()
        const wordText = picker.pickCursorWordText()
        const lineNumber = picker.pickLineNumber()
        // 解析ts文件为语法树
        const sourceFile = TsFileParser.parse(fileName)
        // 获取单词对应的成员信息
        const memberDeclaration = TsFileParser.getMemberInfoByName(sourceFile, wordText, lineNumber);
        if (!memberDeclaration) return
        // 生成注解
        let jsdoc = ''
        if (memberDeclaration instanceof ClassDeclaration) {
            jsdoc = new ClassAnnotation(memberDeclaration).createAnnotation()
        }
        if (memberDeclaration instanceof MethodDeclaration || memberDeclaration instanceof FunctionDeclaration) {
            jsdoc = new MethodAnnotation(memberDeclaration).createAnnotation()

        }
        if (memberDeclaration instanceof PropertyDeclaration) {
            jsdoc = new PropertyAnnotation(memberDeclaration).createAnnotation()
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
