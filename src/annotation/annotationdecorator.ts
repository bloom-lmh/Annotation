import { ConfigLoader } from "../config/configLoader"
import dayjs from 'dayjs'
import { AnnotationConfig, GlobalAnnotationConfig } from "../config/configType"

/**
 * 注解装饰器
 * todo 可以使用装饰器链
 */
export class AnnotationDecorator {
    /**
     * 根据继承信息装饰默认注解
     */
    public static decorateAnnotation(globalConfig: GlobalAnnotationConfig, partialExtend: Array<string>): string {
        // 获取全局配置
        let { author, email, tel, dateTime, version } = globalConfig
        // jsdoc字符串
        let extendJsdocStr = ''
        // 添加作者信息
        if (author && partialExtend.includes('author')) {
            extendJsdocStr += `\n@author ${author}`
        }
        // 添加日期
        if (dateTime && partialExtend.includes('dateTime')) {
            let now = dayjs().format(dateTime)
            // 获取当前日期对象
            extendJsdocStr += `\n@dateTime ${now}`
        }
        // 添加版本
        if (version && partialExtend.includes('version')) {
            extendJsdocStr += `\n@version ${version}`
        }
        // 添加邮件信息
        if (email && partialExtend.includes('email')) {
            extendJsdocStr += `\nemail: ${email}`
        }
        // 添加电话
        if (tel && partialExtend.includes('tel')) {
            extendJsdocStr += `\ntel: ${tel}`
        }
        return extendJsdocStr
    }
}