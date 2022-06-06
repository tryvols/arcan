import { Node, SyntaxKind } from "ts-morph";
import { getNodeFile } from "./get-node-file";
import { getNodeName, getNodeNameOrKindName } from "./get-node-name";

// Incapsulates id creation algorithm
export function getEntityId(node: Node): string {
  const baseIdString = `${getNodeNameOrKindName(node)}:${node.getStartLineNumber()}-${node.getEndLineNumber()}`;
  if (Node.is(SyntaxKind.SourceFile)(node)) {
    return baseIdString;
  }

  const fileName = getNodeName(getNodeFile(node));
  return `${fileName}:${baseIdString}`;
}