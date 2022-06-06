import { EntityType } from "./entity";
import { Graph, GraphNode } from "./graph";

export enum MetricType {
  Entity,
  EntitiesGroup,
  Global
}

export interface MetricDependencies {
  [MetricName: string]: number;
}

export interface AnalyticsData {
  [MetricType.Entity]: {
    [EntityId: string]: MetricDependencies;
  };
  [MetricType.EntitiesGroup]: {
    [GroupName: string]: MetricDependencies;
  };
  [MetricType.Global]: MetricDependencies;
}

export interface Metric {
  id: string;
  name: string;
  description: string;
  type: MetricType;
  dependencies?: Metric[];
}

export type EntityMetricHandlerParams<T extends EntityType = any> = {
  node: GraphNode<T>;
  dependencies?: MetricDependencies;
};
export interface EntityMetric<T extends EntityType = any> extends Metric {
  type: MetricType.Entity;
  supportedEntities: EntityType[];
  handler: (data: EntityMetricHandlerParams<T>) => number;
}

export type EntityGroupMetricHandlerParams<T extends EntityType = any> = {
  nodes: GraphNode<T>[];
  collectedMetrics: AnalyticsData;
};
export interface EntityGroupMetric<T extends EntityType = any> extends Metric {
  type: MetricType.EntitiesGroup;
  supportedEntities: EntityType[];
  handler: (data: EntityGroupMetricHandlerParams<T>) => number;
}

export type GlobalMetricHandlerParams = {
  graph: Graph;
  collectedMetrics: AnalyticsData;
};
export interface GlobalMetric extends Metric {
  type: MetricType.Global;
  handler: (data: GlobalMetricHandlerParams) => number;
}
