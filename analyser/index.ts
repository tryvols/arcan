import { Graph } from "../types/graph";
import { AnalyticsData } from "../types/metric";
import { Protocol } from "../types/protocol";
import { analyseGraph } from "./analyser";
import { buildGraph } from "./graph-builder";
import { AnalyserConfig } from "./types/config";

export function analyseArchitecture(data: Protocol, config: AnalyserConfig): {graph: Graph, metrics: AnalyticsData} {
  const graph = buildGraph(data);
  return {graph, metrics: analyseGraph(graph)};
}