
import { ClassDeclaration, FunctionDeclaration, MethodDeclaration, PropertyDeclaration } from "ts-morph";
import { TsFileParser } from "../parser/tsFileParser";
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
        return `\n${this.className}`
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
    private parameters: Map<string, string>
    /**
     * 返回值
     */
    private returnType: string
    /**
     * 方法抛出的异常
     */
    //private throwError: string
    /**
     * 
     * @param memberDeclaration 方法声明
     */
    constructor(memberDeclaration: MethodDeclaration | FunctionDeclaration) {
        this.startRow = memberDeclaration.getStartLineNumber()
        this.methodName = memberDeclaration.getName() || ''
        this.parameters = TsFileParser.getMethodParameters(memberDeclaration)
        this.returnType = memberDeclaration.getReturnType().getText()
        //this.throwError = 
        TsFileParser.getMethodThrows(memberDeclaration)
    }
    public createAnnotation(): string {
        let paramStr = ''
        for (let [paramName, paramType] of this.parameters) {
            paramStr += `@param {${paramType}} ${paramName}\n`
        }
        return `${this.methodName}\n${paramStr}@returns {${this.returnType}}`
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
     * 属性名
    */
    private propertyName: string

    /**
     * 属性类型
     */
    private propertyType: string
    /**
     * 
     * @param memberDeclaration 方法声明
     */
    constructor(memberDeclaration: PropertyDeclaration) {
        this.startRow = memberDeclaration.getStartLineNumber()
        this.propertyName = memberDeclaration.getName()
        this.propertyType = memberDeclaration.getType().getText()
    }
    public createAnnotation(): string {
        return `${this.propertyName}\n@type {${this.propertyType}}`
    }
}