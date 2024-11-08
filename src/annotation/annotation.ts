import { ClassAnnotationConfig, MethodAnnotationConfig, PropertyAnnotationConfig } from "../config/configtype"
import { AnnotationDecorator } from "./annotationdecorator"

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
    /**
  * 创建注解
  * @returns jsdoc字符串
  */
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
     * 类配置
     */
    private classConfig: ClassAnnotationConfig

    /**
     * 
     * @param className 类名
     * @param isAbstract 是否抽象类
     */
    constructor(startRow: number, className: string, isAbstract: boolean, classConfig: ClassAnnotationConfig) {
        super(startRow)
        this.className = className
        this.isAbstract = isAbstract
        this.classConfig = classConfig
    }
    /**
   * 创建类注解
   * @returns jsdoc字符串
   */
    public createAnnotation(): string {

        // 获取类配置
        let { partialExtend } = this.classConfig
        // jsdoc字符串
        let jsdocStr = ''
        // 类名
        jsdocStr += `\n${this.className}类`
        // 装饰字符串
        if (partialExtend) {
            jsdocStr = AnnotationDecorator.decorateAnnotation(jsdocStr, partialExtend)
        }
        return jsdocStr
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
    private throwErrors: Set<string>
    /**
     * 类配置
     */
    private methodConfig: MethodAnnotationConfig

    /**
     * 
     * @param memberDeclaration 方法声明
     */
    constructor(startRow: number, methodName: string, parameters: Map<string, string>, returnType: string, throwErrors: Set<string>, methodConfig: MethodAnnotationConfig) {
        super(startRow)
        this.methodName = methodName
        this.parameters = parameters
        this.returnType = returnType
        this.throwErrors = throwErrors
        this.methodConfig = methodConfig
    }
    /**
     * 创建注解
     * @returns jsdoc字符串
     */
    public createAnnotation(): string {
        // 获取方法注解配置
        let { parameters, throwErrors, returnType, partialExtend } = this.methodConfig
        // jsdoc字符串
        let jsdocStr = ''
        let paramStr = ''
        let throwStr = ''
        // 添加方法名
        jsdocStr += `\n${this.methodName}`
        // 开启参数
        if (parameters && this.parameters.size > 0) {
            jsdocStr += '\n'
            let index = 0
            for (let [paramName, paramType] of this.parameters) {
                paramStr += `@param {${paramType}} ${paramName}`
                if (index++ != this.parameters.size - 1) {
                    paramStr += '\n'
                }
            }
            jsdocStr += paramStr
        }
        // 返回值
        if (returnType && this.returnType) {
            jsdocStr += `\n@returns {${this.returnType}}`
        }
        // 异常
        if (throwErrors && this.throwErrors.size > 0) {
            let index = 0
            jsdocStr += '\n'
            for (const throwError of this.throwErrors) {
                throwStr += `@throws {${throwError}}`
                if (index++ != this.throwErrors.size - 1) {
                    paramStr += '\n'
                }
            }
            jsdocStr += throwStr
        }
        if (partialExtend) {
            jsdocStr = AnnotationDecorator.decorateAnnotation(jsdocStr, partialExtend)
        }
        return jsdocStr
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
     * 属性注解配置
     */
    private propertyConfig: PropertyAnnotationConfig

    /**
     * 
     * @param memberDeclaration 方法声明
     */
    constructor(startRow: number, propertyName: string, propertyType: string, propertyConfig: PropertyAnnotationConfig) {
        super(startRow)
        this.propertyName = propertyName
        this.propertyType = propertyType
        this.propertyConfig = propertyConfig
    }
    /**
     * 创建注解
     * @returns jsdoc字符串
     */
    public createAnnotation(): string {
        let jsdocStr = ''
        // 根据配置来进行生成
        let { propertyType, partialExtend } = this.propertyConfig
        jsdocStr += `\n${this.propertyName}`
        // 开启类型
        if (propertyType) {
            jsdocStr += `\n@type {${this.propertyType}}`
        }
        if (partialExtend) {
            jsdocStr = AnnotationDecorator.decorateAnnotation(jsdocStr, partialExtend)
        }
        return jsdocStr
    }
}