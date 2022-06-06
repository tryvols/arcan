import { EntityType } from "../types/entity";
import { EntityMetric, EntityMetricHandlerParams, MetricType } from "../types/metric";
import { getCollableChildren } from "../analyser/helpers/get-collable-children";
import { getDataChildren } from "../analyser/helpers/get-data";
import { isUsedBy } from "../analyser/helpers/is-used-by";

export const LCOM: EntityMetric<EntityType.Class> = {
  id: "LCOM",
  name: "LCOM",
  description: "Lack of Cohesion Of Methods",
  type: MetricType.Entity,
  supportedEntities: [EntityType.Class],
  handler: ({node}: EntityMetricHandlerParams): number => {
    const collableChildren = getCollableChildren(node);
    const fields = getDataChildren(node);
    
    if (!fields.length) {
      return 1;
    }

    if (!collableChildren.length) {
      return 0;
    }

    const mfSum = fields
      .map(field =>
        collableChildren.filter(collable => isUsedBy(field, collable)).length
      )
      .reduce((sum, mf) => sum + mf, 0);

    return 1 - mfSum / (collableChildren.length * fields.length);
  }
}