/**
 * 注解交叉项
 */
export interface GlobalAnnotationConfig {
    // 是否加上作者,填写作者名
    author?: string,
    // 是否加上邮箱
    email?: string,
    // 是否加上电话
    tel?: string,
    // 是否加上时间
    dateTime?: string,
    // 版本号
    version?: string
}
/**
 * 注解共有的
 */
interface BaseAnnotation {
    // 是否加上描述
    description?: string | null
    // 对全局部分继承
    partialExtend?: Array<string>
}
/**
 * 类注解
 */
export interface ClassAnnotationConfig extends BaseAnnotation {

}
/**
 * 方法注解
 */
export interface MethodAnnotationConfig extends BaseAnnotation {
    // 参数 可以不开启也可以用户自己指定
    parameters?: boolean | ((parameters: Map<string, string>) => string)
    // 返回值
    returnType?: boolean,
    // 抛出异常
    throwErrors?: boolean | ((throwErrors: Array<string>) => string)
}
/**
 * 属性注解
 */
export interface PropertyAnnotationConfig extends BaseAnnotation {
    // 类型是否开启
    propertyType?: boolean
}

/**
 * 翻译配置
 */
export interface TranslationConfig {
    apiKey?: string | Array<string>,
    open?: boolean,
    wordMaps?: {
        [key: string]: string
    }
}

/**
 * 注解
 */
export interface AnnotationConfig {
    // 全局配置
    globalConfig?: GlobalAnnotationConfig
    // 类配置
    classConfig?: ClassAnnotationConfig,
    // 方法注解配置
    methodConfig?: MethodAnnotationConfig,
    // 属性配置
    propertyConfig?: PropertyAnnotationConfig
    // 单词映射
    translationConfig?: TranslationConfig
}
