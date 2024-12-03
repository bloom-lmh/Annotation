import { JSDocStructure, OptionalKind } from "ts-morph";

abstract class AnnotationStrategy {
    public abstract createAnnotation(): string | OptionalKind<JSDocStructure>
}

/**
 * 生成字符串注解策略
 */
export class StringStrategy extends AnnotationStrategy {
    public createAnnotation(): string | OptionalKind<JSDocStructure> {
        throw new Error("Method not implemented.");
    }

}
/**
 * 生成JSDocStructure策略
 */
export class JSDocStructureStrategy extends AnnotationStrategy {
    public createAnnotation(): string | OptionalKind<JSDocStructure> {
        throw new Error("Method not implemented.");
    }

}