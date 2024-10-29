export enum MemberTypeEnum {
  PROP,
  METHOD,
  CLASS
}
export interface BaseInfo {
  memberType: MemberTypeEnum, startRow: number, name: string
}
export interface ClassInfo extends BaseInfo {
  isAbstract: boolean
}
export interface MethodInfo extends BaseInfo {
  parameters: Map<string, string>[], returnType: string, throwError: string
}
export interface PropertyInfo extends BaseInfo {
  propertyType?: string
}
export interface MemberInfo {
  classes: ClassInfo[],
  methods: MethodInfo[];
  properties: PropertyInfo[];
}