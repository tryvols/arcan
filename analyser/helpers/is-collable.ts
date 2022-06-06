import { EntityType } from "../../types/entity";
import { GraphNode } from "../../types/graph";

export function isCollable(node: GraphNode<any>): boolean {
  return [
    EntityType.Constructor,
    EntityType.FunctionProperty,
    EntityType.Method,
    EntityType.Getter,
    EntityType.Setter,
    EntityType.Function,
    EntityType.FunctionVariable,
    // It's an exception
    EntityType.ClassStaticBlock
  ].some(etype => node.entityType === etype);
}
