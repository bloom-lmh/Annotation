
import { ClassDeclaration, FunctionDeclaration, MethodDeclaration, PropertyDeclaration } from "ts-morph";
import { TsFileParser } from "../parser/tsFileParser";
/**
 * 抽象的注解
 */
export abstract class Annotation {
    public abstract createAnnotation(): string
}
/**
 * 类注释类
 */
export class ClassAnnotation extends Annotation {
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
        super()
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
export class MethodAnnotation extends Annotation {
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
    private throwErrors: Array<string>
    /**
     * 
     * @param memberDeclaration 方法声明
     */
    constructor(memberDeclaration: MethodDeclaration | FunctionDeclaration) {
        super()
        this.startRow = memberDeclaration.getStartLineNumber()
        this.methodName = memberDeclaration.getName() || ''
        this.parameters = TsFileParser.getMethodParameters(memberDeclaration)
        this.returnType = memberDeclaration.getReturnType().getText()
        this.throwErrors = TsFileParser.getMethodThrows(memberDeclaration)
    }
    public createAnnotation(): string {
        let paramStr = ''
        for (let [paramName, paramType] of this.parameters) {
            paramStr += `@param {${paramType}} ${paramName}\n`
        }
        let throwStr = ''
        for (let i = 0; i < this.throwErrors.length; i++) {
            throwStr += `@throws {${this.throwErrors[i]}}`
            if (i < this.throwErrors.length - 1) {
                throwStr += '\n'
            }
        }
        return `${this.methodName}\n${paramStr}@returns {${this.returnType}}\n${throwStr}`
    }
}

/**
 * 属性注释类
 */
export class PropertyAnnotation extends Annotation {
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
        super()
        this.startRow = memberDeclaration.getStartLineNumber()
        this.propertyName = memberDeclaration.getName()
        this.propertyType = memberDeclaration.getType().getText()
    }
    public createAnnotation(): string {
        return `${this.propertyName}\n@type {${this.propertyType}}`
    }
}