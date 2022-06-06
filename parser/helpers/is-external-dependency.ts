import { SourceFile } from "ts-morph";
import { getFilePath } from "./get-file-path";

export function isExternalFileDependency(file: SourceFile): boolean {
  return getFilePath(file).includes("node_modules");
}