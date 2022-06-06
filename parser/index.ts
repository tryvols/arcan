import { Project } from "ts-morph";
import { initProtocol, Protocol } from "../types/protocol";
import { collectEntities } from "./entities-collector";
import { collectEntitiesRelations } from "./relations-collector";
import { ContextType, GeneralContext } from "./types/context";

export function parser(project: Project): Protocol {
  const result: Protocol = initProtocol();

  const context: GeneralContext = {
    type: ContextType.General,
    collectedData: result,
    config: {
      handleProjectDependencies: false
    }
  };

  collectEntities(project, context);
  collectEntitiesRelations(context);

  // Do here loop logic

  return result;
}