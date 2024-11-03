
import { ClassDeclaration, FunctionDeclaration, MethodDeclaration, PropertyDeclaration } from "ts-morph";
import { TsFileParser } from "../parser/tsFileParser";
import { doTranslate } from "../api/translateApi";
/**
 * 抽象的注解
 */
export abstract class Annotation {
    /**
* 首行位置
*/
    private startRow: number
    /**
     * 
     * @param startRow 注释开始行
     */
    constructor(startRow: number) {
        this.startRow = startRow
    }
    public abstract createAnnotation(): string
    /**
     * 
     * @returns 注释开始行
     */
    public getStartRow() {
        return this.startRow
    }
}
/**
 * 类注释类
 */
export class ClassAnnotation extends Annotation {
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
    constructor(startRow: number, className: string, isAbstract: boolean) {
        super(startRow)
        this.className = className
        this.isAbstract = isAbstract
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
    constructor(startRow: number, methodName: string, parameters: Map<string, string>, returnType: string, throwErrors: Array<string>) {
        super(startRow)
        this.methodName = methodName
        this.parameters = parameters
        this.returnType = returnType
        this.throwErrors = throwErrors
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
    constructor(startRow: number, propertyName: string, propertyType: string) {
        super(startRow)
        this.propertyName = propertyName
        this.propertyType = propertyType
    }
    public createAnnotation(): string {
        return `${this.propertyName}\n@type {${this.propertyType}}`
    }
}