import { Node, SourceFile, SyntaxKind } from "ts-morph";

export function getNodeFile(node: Node): SourceFile {
  if (Node.is(SyntaxKind.SourceFile)(node)) {
    return node;
  }
  
  let parent = node.getParent();
  while (parent) {
    if (Node.is(SyntaxKind.SourceFile)(parent)) {
      return parent;
    }

    parent = parent.getParent();
  }

  throw new Error(`Node ${node.getKindName()} isn't part of code!`);
}