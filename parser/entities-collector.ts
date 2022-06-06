import { Project } from "ts-morph";
import { handleFile } from "./node-handler";
import { GeneralContext } from "./types/context"

export const collectEntities = (project: Project, context: GeneralContext) => {
  const files = project.getSourceFiles();

  files.forEach(file => {
    const ext = file.getExtension();
    if (!['.ts', '.tsx', '.d.ts'].includes(ext)) {
      return;
    }

    handleFile(file, context);
  });
};
