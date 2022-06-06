import { EntityType } from "../types/entity";
import { Graph, GraphNode } from "../types/graph";
import { AnalyticsData, EntityGroupMetric, EntityMetric, GlobalMetric, Metric, MetricType } from "../types/metric";
import { Instability } from "../metrics/instability";
import { LCOM } from "../metrics/lcom";
import { Modularity } from "../metrics/modularity";
import { ModuleCohesion } from "../metrics/module-cohesion";

export const analyseGraph = (graph: Graph): AnalyticsData => {
  const data: AnalyticsData = {
    [MetricType.Entity]: {},
    [MetricType.EntitiesGroup]: {},
    [MetricType.Global]: {}
  };

  // Metrics ordering should be handled automatically to allow easily extend metrics
  const order = [Instability, LCOM, ModuleCohesion, Modularity] as (GlobalMetric | EntityGroupMetric | EntityMetric)[];
  order.forEach(async metric => {
    if (metric.type === MetricType.Entity) {
      await handleEntityMetric(metric, graph, data);
    } else if (metric.type === MetricType.EntitiesGroup) {
      await handleEntityGroupMetric(metric, graph, data);
    } else if (metric.type === MetricType.Global) {
      await handleGlobalMetric(metric, graph, data);
    }
  });

  return data;
};

const handleEntityMetric = async (metric: EntityMetric, graph: Graph, data: AnalyticsData): Promise<void> => {
  const applyMetric = applyEntityMetric(metric, data);

  metric.supportedEntities.forEach(type => {
    if (type === EntityType.Class) {
      return graph.classes.forEach(applyMetric);
    } else if (type === EntityType.ClassStaticBlock) {
      return graph.classStaticBlocks.forEach(applyMetric);
    } else if (type === EntityType.Constructor) {
      return graph.constructors.forEach(applyMetric);
    } else if (type === EntityType.Enum) {
      return graph.enums.forEach(applyMetric);
    } else if (type === EntityType.Field) {
      return graph.fields.forEach(applyMetric);
    } else if (type === EntityType.File) {
      return graph.files.forEach(applyMetric);
    } else if (type === EntityType.Function) {
      return graph.functions.forEach(applyMetric);
    } else if (type === EntityType.FunctionProperty) {
      return graph.functionProperties.forEach(applyMetric);
    } else if (type === EntityType.FunctionVariable) {
      return graph.functionVariables.forEach(applyMetric);
    } else if (type === EntityType.Getter) {
      return graph.getters.forEach(applyMetric);
    } else if (type === EntityType.Interface) {
      return graph.interfaces.forEach(applyMetric);
    } else if (type === EntityType.Method) {
      return graph.methods.forEach(applyMetric);
    } else if (type === EntityType.Namespace) {
      return graph.namespaces.forEach(applyMetric);
    } else if (type === EntityType.Setter) {
      return graph.setters.forEach(applyMetric);
    } else if (type === EntityType.Type) {
      return graph.types.forEach(applyMetric);
    } else if (type === EntityType.Variable) {
      return graph.variables.forEach(applyMetric);
    }
  });
};

const applyEntityMetric = (metric: EntityMetric, data: AnalyticsData) => (node: GraphNode<any>): void => {
  const value = metric.handler({node, dependencies: data?.[MetricType.Entity]?.[node.id]});
  if (!data[MetricType.Entity]?.[node.id]) {
    data[MetricType.Entity][node.id] = {};
  }
  data[MetricType.Entity][node.id][metric.id] = value;
};

const handleEntityGroupMetric = (metric: EntityGroupMetric, graph: Graph, data: AnalyticsData): void => {
  const applyMetric = applyEntitiesGroupMetric(metric, data);

  metric.supportedEntities.forEach(type => {
    if (type === EntityType.Class) {
      return applyMetric(graph.classes);
    } else if (type === EntityType.ClassStaticBlock) {
      return applyMetric(graph.classStaticBlocks);
    } else if (type === EntityType.Constructor) {
      return applyMetric(graph.constructors);
    } else if (type === EntityType.Enum) {
      return applyMetric(graph.enums);
    } else if (type === EntityType.Field) {
      return applyMetric(graph.fields);
    } else if (type === EntityType.File) {
      return applyMetric(graph.files);
    } else if (type === EntityType.Function) {
      return applyMetric(graph.functions);
    } else if (type === EntityType.FunctionProperty) {
      return applyMetric(graph.functionProperties);
    } else if (type === EntityType.FunctionVariable) {
      return applyMetric(graph.functionVariables);
    } else if (type === EntityType.Getter) {
      return applyMetric(graph.getters);
    } else if (type === EntityType.Interface) {
      return applyMetric(graph.interfaces);
    } else if (type === EntityType.Method) {
      return applyMetric(graph.methods);
    } else if (type === EntityType.Namespace) {
      return applyMetric(graph.namespaces);
    } else if (type === EntityType.Setter) {
      return applyMetric(graph.setters);
    } else if (type === EntityType.Type) {
      return applyMetric(graph.types);
    } else if (type === EntityType.Variable) {
      return applyMetric(graph.variables);
    }
  });
};

const applyEntitiesGroupMetric = (metric: EntityGroupMetric, data: AnalyticsData) => (nodes: GraphNode<EntityType>[]): void => {
  if (!nodes.length) {
    return;
  }

  const groupEntityType = nodes[0].entityType;

  const value = metric.handler({nodes, collectedMetrics: data});
  if (!data[MetricType.EntitiesGroup]?.[groupEntityType]) {
    data[MetricType.EntitiesGroup][groupEntityType] = {};
  }
  data[MetricType.EntitiesGroup][groupEntityType][metric.id] = value;
}

const handleGlobalMetric = (metric: GlobalMetric, graph: Graph, data: AnalyticsData): void => {
  const value = metric.handler({graph, collectedMetrics: data});
  data[MetricType.Global][metric.id] = value;
};
