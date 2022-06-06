import { PropertyDeclaration, SyntaxKind, VariableDeclaration } from "ts-morph";

export function containsFunction(node: VariableDeclaration | PropertyDeclaration) {
  const isFunctionExpression = !!node.getChildrenOfKind(SyntaxKind.FunctionExpression).length;
  const isArrowFunction = !!node.getChildrenOfKind(SyntaxKind.ArrowFunction).length;

  return isFunctionExpression || isArrowFunction;
}
