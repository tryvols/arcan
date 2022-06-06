import { EntityType } from "../../types/entity";
import { GraphNode } from "../../types/graph";

export function isData(node: GraphNode<any>): boolean {
  return [
    EntityType.Enum,
    EntityType.Field,
    EntityType.Variable
  ].some(etype => etype === node.entityType);
}
