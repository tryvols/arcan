import { Context } from "./parser/types/context";

interface TestInterface {}
interface TestInterface2 extends TestInterface, Context {}

type SomeType = TestInterface | TestInterface2;

const someFunctionVariable = function () {}
const arrowFunctionVariable = () => {}

enum SomeTestEnum {
  One,
  Two,
  Three
}

const someVal = SomeTestEnum.One;

export default class BaseClass<T extends typeof someVal> implements TestInterface {
  constructor() {
    BaseClass.key = 3;
  }

  set setSomething(val: number) {
    BaseClass.key = val;
  }

  static key: number = 2;

  funcProp = () => {
    BaseClass.key = 4;
  }

  methodProp = function () {
    BaseClass.key = 5;
  }

  someMethod() {
    const someInternalVariable = 3;
  }

  static staticMethod() {
    BaseClass.key = 7;
  }
}

const TestClassExpression = class extends BaseClass<typeof someVal> implements BaseClass<typeof someVal> {};
const TestFunc = function () {};

export class OutsideClass<T extends SomeTestEnum.One, G extends BaseClass<typeof someVal>> extends BaseClass<T> {
  property: T;

  constructor(iv: T) {
    super();
    this.property = iv;
  }

  doSomething() {
    console.log(this.property);
  }

  set setSmth(val: T) {
    this.property = val;
  }

  get getProperty() {
    return this.property;
  }
}

export namespace SomeTestNamespace {
  export namespace InsideNamespace {
    export class OtherClass {

    }

    function someFunc() {

    }
  }

  const someConst = 1;

  const otherConst = 2;

  function someFunc() {
    console.log(someConst);
    console.log(otherConst);
  }

  export class TestClass {
    constructor(obj1: InsideNamespace.OtherClass) {
      console.log(obj1);
      someFunc();
    }
  }

  export class SomeClass extends InsideNamespace.OtherClass {
    
  }

  new TestClass(new InsideNamespace.OtherClass());
}