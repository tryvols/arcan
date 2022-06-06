import { Graph } from "../types/graph";
import { AnalyticsData } from "../types/metric";
import { reportToConsole } from "./console";

export const reportResult = (graph: Graph, metrics: AnalyticsData): void => {
  reportToConsole(graph, metrics);
};