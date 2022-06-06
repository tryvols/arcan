import { Relation, RelationType } from "../../types/relation";

type RelationIdParams = Omit<Relation, "id">;
export function getRelationId({entity1, entity2, type: relationType}: RelationIdParams): string {
  return `${entity1.id} => ${RelationType[relationType]} => ${entity2.id}`
}
