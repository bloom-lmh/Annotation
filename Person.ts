class Person {
  private name: string;
  constructor(name: string) {
    this.name = name
  }
  public getName() {
    this.name
  }
  public setName(name: string) {
    this.name = name
  }

  public get age() {
    return 22
  }
  public set age(age: number) {
    this.age = age
  }
}