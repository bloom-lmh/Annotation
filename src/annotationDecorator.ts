/**
 * 抽象装饰器
 */
export abstract class AnnotationDecorator {
  /**
   * 添加注释
   */
  public abstract addAnnotation(): void
}

/**
 * 类注释装饰器
 */
export class ClassAnnotationDecorator extends AnnotationDecorator {
  /**
   * 添加注释
   */
  public addAnnotation(): void {
    console.log("添加注释");

  }

}