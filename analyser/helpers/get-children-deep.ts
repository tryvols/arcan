import { EntityType } from "../../types/entity";
import { GraphNode } from "../../types/graph";
import { getChildren } from "./get-children";

export function getChildrenDeep(node: GraphNode<EntityType>): GraphNode<EntityType>[] {
  const children = getChildren(node);

  if (children.length) {
    const deeperChildren = children
      .map(getChildrenDeep)
      .reduce<GraphNode<EntityType>[]>((acc, dc) => {
        return [...acc, ...dc];
      }, []);

    return [...children, ...deeperChildren];
  }
  return children;
}
