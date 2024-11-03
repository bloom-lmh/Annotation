/**
 * 配置对象
 */
export interface ClassAnnotationConfig {

}
export interface MethodAnnotationConfig {
    // 参数 可以不开启也可以用户自己指定
    parameters: boolean | ((paramName: string, paramValue: string) => string)
    // 返回值
    returnType: boolean
}
export interface PropertyAnnotationConfig {

}
export interface AnnotationConfig {
    class: ClassAnnotationConfig
}
/**
 * 配置类
 * @description 用于加载配置，导出配置
 */
export class Config {
    /**
     * 加载配置
     */
    loadConfig() { }
}