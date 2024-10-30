import ts from "typescript";
import { PickContext } from "../picker/pickcontext";
import { ClassInfo, MethodInfo, PropertyInfo } from "../type";
import * as vscode from 'vscode';
import { ClassDeclaration, FunctionDeclaration, MethodDeclaration, Project, PropertyDeclaration, SourceFile } from "ts-morph";
/**
 * 类注释类
 */
export class ClassAnnotation {
  /**
* 首行位置
*/
  private startRow: number
  /** 
   * 类名
  */
  private className: string
  /**
   * 是否抽象类
   */
  private isAbstract: boolean

  /**
   * 
   * @param className 类名
   * @param isAbstract 是否抽象类
   */
  constructor(memberDeclaration: ClassDeclaration) {
    this.startRow = memberDeclaration.getStartLineNumber()
    this.className = memberDeclaration.getName() || ''
    this.isAbstract = memberDeclaration.isAbstract()
  }
  /**
   * 创建注解
   */
  public createAnnotation(): string {
    return `
    ${this.className}
   `

  }
}
/**
 * 方法注释类
 */
export class MethodAnnotation {
  /**
 * 首行位置
 */
  private startRow: number
  /**
   * 方法名
   */
  private methodName: string
  /**
   * 方法参数
   */
  private parameters: Map<string, string>[]
  /**
   * 返回值
   */
  private returnType: string
  /**
   * 方法抛出的异常
   */
  private throwError: string
  /**
     * 编辑器对象
     */
  private editor: vscode.TextEditor

  constructor(context: PickContext, member: MethodInfo) {
    this.startRow = member.startRow
    this.methodName = member.name
    this.parameters = member.parameters
    this.returnType = member.returnType
    this.throwError = member.throwError
    this.editor = context.getEditor()
  }
  public createAnnotation(): void {
    const document = this.editor.document
    // 获取当前行的文本  
    this.editor.edit(editBuilder => {
      let positionAfterLine = new vscode.Position(this.startRow - 1, 0);
      editBuilder.insert(positionAfterLine, `\n/**
 * 
 * ${this.methodName}
 * @returns {${this.returnType}}
 * @throw {${this.throwError}}
 */\n`);
      vscode.workspace.save(document.uri)
    }).then(success => {
      if (!success) {
        vscode.window.showErrorMessage('Failed to insert getter and setter methods.');
      }
    });
  }
}

/**
 * 属性注释类
 */
export class PropertyAnnotation {
  /**
   * 首行位置
   */
  private startRow: number

  /**
      * 编辑器对象
      */
  private editor: vscode.TextEditor
  /** 
   * 属性名
  */
  private propertyName: string

  /**
   * 属性类型
   */
  private propertyType: string

  constructor(context: PickContext, member: PropertyInfo) {
    this.startRow = member.startRow
    this.propertyName = member.name
    this.propertyType = member.propertyType || ''
    this.editor = context.getEditor()
  }
  public createAnnotation(): void {
    const document = this.editor.document
    // 获取当前行的文本  
    this.editor.edit(editBuilder => {
      let positionAfterLine = new vscode.Position(this.startRow - 1, 0);
      editBuilder.insert(positionAfterLine, `\n/**
 * 
 * ${this.propertyName}
 * @type {${this.propertyType}}
 */\n`);
      vscode.workspace.save(document.uri)
    }).then(success => {
      if (!success) {
        vscode.window.showErrorMessage('Failed to insert getter and setter methods.');
      }
    });
  }
}