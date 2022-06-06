import { SourceFile } from "ts-morph";

export function getFilePath(file: SourceFile): string {
  const rootPath = file.getProject().getFileSystem().getCurrentDirectory();
  return file ? file.getFilePath().replace(rootPath, "") : "";
}