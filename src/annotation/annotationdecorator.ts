import { Annotation } from "./annotation";

/**
 * 注解装饰器
 */
export abstract class AnnotationDecorator extends Annotation {
    /**
     * 注解
     */
    private annotation: Annotation
    /**
     * 抽象的注释类
     * @param annotation 注解
     */
    constructor(annotation: Annotation) {
        super()
        this.annotation = annotation
    }
}

/**
 * 注解装饰器，建立翻译以及用户个性化配置
 */
export class UserAnnotationDecorator extends AnnotationDecorator {
    /**
     * 用户注解装饰构造器
     */
    constructor(annotation: Annotation) {
        super(annotation)
    }
    /**
     * 装饰
     */
    public createAnnotation(): string {
        // 获取用户配置
        throw new Error("Method not implemented.");
    }
}