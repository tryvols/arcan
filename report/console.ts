import { EntityGroupsNames, Graph, GraphNode } from "../types/graph";
import { AnalyticsData, MetricDependencies, MetricType } from "../types/metric";
import * as metrics from "../metrics";
import { EntityType } from "../types/entity";
import { startCase } from "lodash";

const allMetrics = Object.values(metrics);

type AllNodes = {[key: string]: GraphNode<any>};

export const reportToConsole = (graph: Graph, metricsData: AnalyticsData): void => {
  const mappedNodes = graph.allNodes.reduce((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {} as AllNodes);

  console.log("");
  reportGlobalMetrics(metricsData);
  reportEntitiesGroupsMetrics(metricsData);
  reportEntityMetrics(metricsData, mappedNodes);
};

const reportGlobalMetrics = (metricsData: AnalyticsData): void => {
  const globalMetrics = metricsData[MetricType.Global];
  if (!globalMetrics.length) {
    return;
  }

  title("Global Metrics");
  reportMetricsValues(globalMetrics);
  console.log("");
};

const reportEntitiesGroupsMetrics = (metricsData: AnalyticsData): void => {
  const entitiesGroupsMetrics = Object.entries(metricsData[MetricType.EntitiesGroup]);
  if (!entitiesGroupsMetrics.length) {
    return;
  }

  title("Groups of Entities");

  entitiesGroupsMetrics.forEach(([visibleName, metricValues]) => {
    header3(EntityGroupsNames[visibleName as unknown as EntityType]);
    reportMetricsValues(metricValues);
    console.log("");
  });
};

const reportEntityMetrics = (metricsData: AnalyticsData, allNodes: AllNodes): void => {
  const entityMetrics = Object.entries(metricsData[MetricType.Entity]);
  if (!entityMetrics) {
    return;
  }

  title("Entity Metrics");

  entityMetrics.forEach(([nodeId, metricsList]) => {
    const node = allNodes[nodeId];

    if (!node) {
      throw new Error(`Node with id ${nodeId} should exists`);
    }

    const parentName = node.relations.find(rel => rel.node1.id === node.id)?.node2.name;
    const formattedParentName = parentName ? `(children of "${parentName}")` : "";
    const entityType = startCase(EntityType[node.entityType]);

    header3(`${entityType} "${node.name}" ${formattedParentName}`);
    reportMetricsValues(metricsList);
    console.log("");
  });
};

/**
 * Helpers
 */

const reportMetricsValues = (values: MetricDependencies): void => {
  Object.entries(values).forEach(([metricId, value]) => {
    const metric = allMetrics.find(m => m.id === metricId);

    if (!metric) {
      throw new Error(`Metric with id ${metricId} should exists!`);
    }

    console.log(`- ${metric.name}: ${formatValue(value)}`);
  })
};

const title = (name: string): void => {
  const main = `# ${name} #`;
  const border = new Array(main.length).fill("#").join("");

  console.log(border);
  console.log(main);
  console.log(border);
  console.log("");
};

const subtitle = (name: string): void => {
  const main = `# ${name} `;
  const bottomBorder = new Array(main.length).fill("#").join();

  console.log("#");
  console.log(main);
  console.log(bottomBorder);
  console.log("");
};

const header3 = (name: string): void => {
  console.log(name);
  separator();
};

const separator = (): void => {
  console.log("--------------------------------------------------------------------");
};

const formatValue = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};
