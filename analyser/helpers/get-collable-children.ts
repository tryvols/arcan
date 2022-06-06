import { GraphNode } from "../../types/graph";
import { isCollable } from "./is-collable";
import { getChildren } from "./get-children";

export function getCollableChildren(node: GraphNode<any>) {
  return getChildren(node).filter(isCollable);
}
