import { GraphNode, GraphRelation } from "../../types/graph";
import { RelationType } from "../../types/relation";
import { getChildrenDeep } from "./get-children-deep";

// Should use deep aslgorithm
export function isUsedBy(node: GraphNode<any>, possibleClient: GraphNode<any>, withoutDirection: boolean = false): boolean {
  const nodeRelations = [node, ...getChildrenDeep(node)]
    .reduce<GraphRelation[]>((acc, child) => {
      return [...acc, ...child.relations];
    }, []);
  const clientRelations = [possibleClient, ...getChildrenDeep(possibleClient)]
    .reduce<GraphRelation[]>((acc, child) => {
      return [...acc, ...child.relations];
    }, []);

  if (withoutDirection) {
    return (
      nodeRelations.some(rel =>
        rel.node1.id === possibleClient.id
        && rel.type === RelationType.UsedBy
      )
      || clientRelations.some(rel =>
        rel.node1.id === node.id
        && rel.type === RelationType.UsedBy
      )
    );
  }

  return nodeRelations.some(rel =>
    rel.node1.id === possibleClient.id
    && rel.type === RelationType.UsedBy
  );
}