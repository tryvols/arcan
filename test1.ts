import { OutsideClass, SomeTestNamespace } from "./test";

export function factoryFunc() {
  const insideClass = new SomeTestNamespace.InsideNamespace.OtherClass();
  return new SomeTestNamespace.TestClass(insideClass);
}

const instance = factoryFunc();

function some() {
  console.log(factoryFunc());

  enum SomeEnum {
    One,
    Two
  }
}
some();

type Some = "asdf";

const obj2 = new OutsideClass(1);
