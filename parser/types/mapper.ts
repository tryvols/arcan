import { CodeEntity, Entity, EntityType, SupportedCodeNodeType, SupportedNodeType } from "../../types/entity";
import { CodeEntityContext, Context } from "./context";

export interface Mapper<NT extends SupportedNodeType, E extends Entity<any, any>, C extends Context> {
  (node: NT, context: C): E;
}

export interface BaseEntityMapper {
  <T extends EntityType, NT extends SupportedNodeType>(type: T, node: NT, context: Context): Entity<T, NT>;
}

export interface BaseCodeEntityMapper {
  <T extends EntityType, NT extends SupportedCodeNodeType>(type: T, node: NT, context: CodeEntityContext): CodeEntity<T, NT>;
}