import { Entity, EntityType, SupportedNodeType } from "./entity";

export enum RelationType {
  ChidlrenOf,
  Extends,
  Implements,
  UsedBy
}

export interface Relation {
  id: string;
  entity1: Entity<EntityType, SupportedNodeType>;
  entity2: Entity<EntityType, SupportedNodeType>;
  type: RelationType;
}