import { GraphNode } from "../../types/graph";
import { getChildren } from "./get-children";
import { isData } from "./is-data";

export function getDataChildren(node: GraphNode<any>): GraphNode<any>[] {
  return getChildren(node).filter(isData);
}
