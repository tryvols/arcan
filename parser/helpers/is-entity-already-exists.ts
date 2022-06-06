import { Entity, EntityType, SupportedNodeType } from "../../types/entity";

export function doesEntityAlreadyExists<T extends EntityType, NT extends SupportedNodeType>(
  array: Entity<T, NT>[],
  id: Entity<T, NT>["id"]
): boolean {
  return array.some(e => e.id === id);
}
