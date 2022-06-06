import { isNumber } from "lodash";
import { EntityType } from "../types/entity";
import { EntityMetric, EntityMetricHandlerParams, MetricType } from "../types/metric";
import { Instability } from "./instability";
import { LCOM } from "./lcom";
import { ModuleCohesion } from "./module-cohesion";

export const Modularity: EntityMetric = {
  id: "Modularity",
  name: "Modularity",
  description: "Shows entity modularity level",
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
  dependencies: [Instability, LCOM, ModuleCohesion],
  handler: ({node, dependencies}: EntityMetricHandlerParams) => {
    const instability = dependencies?.[Instability.id];

    if (!isNumber(instability)) {
      throw new Error("Instability should be already calculated");
    }

    const stability = 1 - instability;

    if (node.entityType === EntityType.Class) {
      const lcom = dependencies?.[LCOM.id];

      if (!isNumber(lcom)) {
        throw new Error("LCOM should be already calculated!");
      }

      const cohesion = 1 - lcom;

      return stability * cohesion;
    }

    if (
      [
        EntityType.Namespace,
        EntityType.File
      ].some((type: EntityType) => type === node.entityType)
    ) {
      const cohesion = dependencies?.[ModuleCohesion.id];

      if (!isNumber(cohesion)) {
        throw new Error("Cohesion should be already calculated");
      }

      return stability * cohesion;
    }

    return stability;
  }
};
