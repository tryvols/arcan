import { Node } from "ts-morph";
import { Protocol } from "../../types/protocol";
import { FileEntity } from "../../types/entity";

export enum ContextType {
  General = 1,
  CodeEntity = 2
}

export interface Context {
  type: ContextType;
  collectedData: Protocol;
  config: {
    handleProjectDependencies: boolean;
  };
}

export interface GeneralContext extends Context {
  type: ContextType.General;
}

export interface CodeEntityContext extends Context {
  type: ContextType.CodeEntity;
  parents: Node[];
  parentFile: FileEntity;
}

export type PossibleContexts = Context | CodeEntityContext;
