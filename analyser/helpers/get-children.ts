import { EntityType } from "../../types/entity";
import { GraphNode } from "../../types/graph";
import { RelationType } from "../../types/relation";

export function getChildren(node: GraphNode<EntityType>): GraphNode<EntityType>[] {
  return node.relations
    .filter(rel => {
      if (rel.type !== RelationType.ChidlrenOf) {
        return false;
      }
      const child = rel.node1;

      // If the children is current element
      return child.id !== node.id;
    })
    .map(rel => rel.node1);
}
