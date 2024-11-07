import { ClassDeclaration, FunctionDeclaration, MethodDeclaration, PropertyDeclaration } from "ts-morph";
import { Annotation, ClassAnnotation, MethodAnnotation, PropertyAnnotation } from '../annotation/annotation';
import { TsFileParser } from "../parser/tsFileParser";
import { AnnotationConfig } from "../config/configmanager";
import { WordUtil } from "../utils/wordutil";
/**
 * 注解工厂
 */
export class AnnotationFactory {
    /**
     * 获取注解对象
     */
    public static async getAnnotation(memberDeclaration: ClassDeclaration | MethodDeclaration | PropertyDeclaration | FunctionDeclaration, annotationConfig: AnnotationConfig): Promise<Annotation | null> {
        // 获取成员开始行号
        const startRow = memberDeclaration.getStartLineNumber()
        // 获取成员名
        let memberName = memberDeclaration.getName() || ''
        // 解构用户配置
        const { classConfig, methodConfig, propertyConfig, globalConfig, wordMaps } = annotationConfig
        // 调用翻译接口进行翻译
        memberName = await WordUtil.handleWord(memberName, wordMaps)
        // 若成员是类，创建类注释对象
        if (memberDeclaration instanceof ClassDeclaration) {
            const isAbstract = memberDeclaration.isAbstract()
            return new ClassAnnotation(startRow, memberName, isAbstract)
        }
        // 若成员是方法，创建方法注释对象
        if (memberDeclaration instanceof MethodDeclaration || memberDeclaration instanceof FunctionDeclaration) {
            const parameters = TsFileParser.getMethodParameters(memberDeclaration)
            const returnType = memberDeclaration.getReturnType().getText()
            const throwErrors = TsFileParser.getMethodThrows(memberDeclaration)
            return new MethodAnnotation(startRow, memberName, parameters, returnType, throwErrors)
        }
        // 若成员是属性，创建属性注释对象
        if (memberDeclaration instanceof PropertyDeclaration) {
            const propertyType = memberDeclaration.getType().getText()
            return new PropertyAnnotation(startRow, memberName, propertyType)
        }
        return null
    }
}