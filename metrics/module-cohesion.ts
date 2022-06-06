import { EntityType } from "../types/entity";
import { GraphNode } from "../types/graph";
import { EntityMetric, Metric, MetricType } from "../types/metric";
import { getChildren } from "../analyser/helpers/get-children";
import { isExtendsWith } from "../analyser/helpers/is-extends-with";
import { isImplementsWith } from "../analyser/helpers/is-implements-with";
import { isUsedBy } from "../analyser/helpers/is-used-by";

type Subgraphs = Array<GraphNode<any>[]>;

function getSubgraphs(nodes: GraphNode<any>[]): Subgraphs {
  return nodes.reduce<Subgraphs>((subs, sn) => {
    for (let id in subs) {
      const relatesToCurrentSubgraph = subs[id].some(n => {
        return isUsedBy(sn, n, true) || isExtendsWith(sn, n, true) || isImplementsWith(sn, n, true);
      });

      if (relatesToCurrentSubgraph) {
        subs[id].push(sn);
        return subs;
      }
    }
    return [...subs, [sn]];
  }, []);
}

function getSubgraphRelationsCount(subgraph: GraphNode<any>[]): number {
  let subgraphRelationsCount = 0;

  if (subgraph.length > 1) {
    for (let i = 0; i < subgraph.length; i++) {
      for (let j = i + 1; j < subgraph.length; j++) {
        const [n1, n2] = [subgraph[i], subgraph[j]];
        if (isUsedBy(n1, n2, true) || isExtendsWith(n1, n2, true) || isImplementsWith(n1, n2)) {
          subgraphRelationsCount += 1;
        }
      }
    }
  }

  return subgraphRelationsCount;
}

export const ModuleCohesion: EntityMetric<EntityType.Namespace | EntityType.File> = {
  id: "Module Cohesion",
  name: "Module Cohesion",
  description: "Cohesion of a module",
  type: MetricType.Entity,
  supportedEntities: [EntityType.Namespace, EntityType.File],
  handler: ({node}): number => {
    const children = getChildren(node);

    if (!children.length) {
      return 0;
    }

    // Actually not sure
    if (children.length === 1) {
      return 1;
    }

    const subgraphs = getSubgraphs(children);

    const largestSubgraph = subgraphs.reduce((largest, subgraph) => {
      return largest.length < subgraph.length ? subgraph : largest;
    }, []);

    const subgraphRelationsCount = getSubgraphRelationsCount(largestSubgraph);
    
    // With `- children.length` we are removing medium diagonal of the matrix
    // And with division for 2 we are removing mirror dependencies as our dependencies are without direction
    return subgraphRelationsCount / ((children.length * children.length - children.length) / 2);
  }
};
