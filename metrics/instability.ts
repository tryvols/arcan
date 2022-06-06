import { EntityType } from "../types/entity";
import { GraphRelation } from "../types/graph";
import { EntityMetric, EntityMetricHandlerParams, MetricType } from "../types/metric";
import { RelationType } from "../types/relation";
import { getChildrenDeep } from "../analyser/helpers/get-children-deep";

interface InstabilityRelations {
  incoming: GraphRelation[];
  outcoming: GraphRelation[];
}

export const Instability: EntityMetric = {
  id: "Instability",
  name: "Instability",
  description: "Describe how often component may require changes",
  type: MetricType.Entity,
  supportedEntities: [
    EntityType.Class,
    EntityType.ClassStaticBlock,
    EntityType.Constructor,
    EntityType.Enum,
    EntityType.Field,
    EntityType.File,
    EntityType.Function,
    EntityType.FunctionProperty,
    EntityType.FunctionVariable,
    EntityType.Getter,
    EntityType.Interface,
    EntityType.Method,
    EntityType.Setter,
    EntityType.Namespace,
    EntityType.Type,
    EntityType.Variable
  ],
  handler: ({node}: EntityMetricHandlerParams): number => {
    // For now the instability is only internal, as we are omitting external project dependencies
    const relations = [node, ...getChildrenDeep(node)]
      .reduce<InstabilityRelations>(((rels, n) => {
        for (let rel of n.relations) {
          if (
            [
              RelationType.Extends,
              RelationType.Implements
            ].some(relType => relType === rel.type)
          ) {
            if (rel.node1.id === n.id) {
              rels.outcoming.push(rel);
            } else {
              rels.incoming.push(rel);
            }
          }

          if (rel.type === RelationType.UsedBy) {
            if (rel.node2.id === n.id) {
              rels.outcoming.push(rel);
            } else {
              rels.incoming.push(rel);
            }
          }
        }
        return rels;
      }), {incoming: [], outcoming: []});

    if (!relations.incoming.length && !relations.outcoming.length) {
      return 0;
    }
    
    return relations.outcoming.length / (relations.incoming.length + relations.outcoming.length);
  }
};