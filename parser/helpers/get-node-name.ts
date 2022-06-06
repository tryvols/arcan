import { Node } from "ts-morph";

export function getNodeName(node: Node): string {
  if (Node.hasName(node)) {
    return node.getName();
  }

  if (Node.isSourceFile(node)) {
    return node.getBaseName();
  }

  return "";
}

export function getNodeNameOrKindName(node: Node): string {
  const name = getNodeName(node);
  // If the node doesn't have name (like anonymous function or class)
  return name || node.getKindName();
}