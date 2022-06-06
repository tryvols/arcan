import { Node, SourceFile, SyntaxKind } from "ts-morph";
import { EntityType, SupportedNodeType, Entity, SupportedEntities, FileEntity, ClassEntity } from "../types/entity";
import { doesEntityAlreadyExists } from "./helpers/is-entity-already-exists";
import { nodeToEntity } from "./node-to-entity-mappers";
import { CodeEntityContext, Context, ContextType, GeneralContext, PossibleContexts } from "./types/context";

export const handleFile = (file: SourceFile, context: GeneralContext): void => {
  const classes = file.getDescendantsOfKind(SyntaxKind.ClassDeclaration);
  const namespaces = file.getDescendantsOfKind(SyntaxKind.ModuleDeclaration);
  const functions = file.getDescendantsOfKind(SyntaxKind.FunctionDeclaration);
  const enums = file.getDescendantsOfKind(SyntaxKind.EnumDeclaration);
  const interfaces = file.getDescendantsOfKind(SyntaxKind.InterfaceDeclaration);
  const types = file.getDescendantsOfKind(SyntaxKind.TypeAliasDeclaration);
  const variables = file.getDescendantsOfKind(SyntaxKind.VariableDeclaration);

  const fileEntity = handleNode(file, context) as FileEntity;

  const newContext: CodeEntityContext = {
    ...context,
    type: ContextType.CodeEntity,
    parents: [file],
    parentFile: fileEntity
  };

  [
    classes,
    namespaces,
    functions,
    enums,
    interfaces,
    types,
    variables
  ].forEach(nodes => handleNodes(nodes, newContext));
};

export const handleNodes = (nodes: SupportedNodeType[], context: PossibleContexts): void => {
  nodes.forEach(node => handleNode(node, context));
};

export const handleNode = (node: SupportedNodeType, context: PossibleContexts): SupportedEntities | undefined => {
  const entity = nodeToEntity(node, context);
  if (!entity) {
    return;
  }

  saveNode(entity, context);
  handleNodeDescendants(entity, context);

  return entity;
};

const saveNode = (entity: SupportedEntities, context: Context): void => {
  if (EntityType.is(entity, EntityType.File)) {
    return saveNodeToCollection(entity, context.collectedData.files);
  }
  if (EntityType.is(entity, EntityType.Namespace)) {
    return saveNodeToCollection(entity, context.collectedData.namespaces);
  }
  if (EntityType.is(entity, EntityType.Function)) {
    return saveNodeToCollection(entity, context.collectedData.functions);
  }
  if (EntityType.is(entity, EntityType.Class)) {
    return saveNodeToCollection(entity, context.collectedData.classes);
  }
  if (EntityType.is(entity, EntityType.Interface)) {
    return saveNodeToCollection(entity, context.collectedData.interfaces);
  }
  if (EntityType.is(entity, EntityType.Enum)) {
    return saveNodeToCollection(entity, context.collectedData.enums);
  }
  if (EntityType.is(entity, EntityType.Type)) {
    return saveNodeToCollection(entity, context.collectedData.types);
  }
  if (EntityType.is(entity, EntityType.Variable)) {
    return saveNodeToCollection(entity, context.collectedData.variables);
  }
  /**
   * Additional entities
   */
  if (EntityType.is(entity, EntityType.Constructor)) {
    return saveNodeToCollection(entity, context.collectedData.constructors);
  }
  if (EntityType.is(entity, EntityType.Setter)) {
    return saveNodeToCollection(entity, context.collectedData.setters);
  }
  if (EntityType.is(entity, EntityType.Getter)) {
    return saveNodeToCollection(entity, context.collectedData.getters);
  }
  if (EntityType.is(entity, EntityType.Method)) {
    return saveNodeToCollection(entity, context.collectedData.methods);
  }
  if (EntityType.is(entity, EntityType.Field)) {
    return saveNodeToCollection(entity, context.collectedData.fields);
  }
  if (EntityType.is(entity, EntityType.ClassStaticBlock)) {
    return saveNodeToCollection(entity, context.collectedData.classStaticBlocks);
  }
  if (EntityType.is(entity, EntityType.FunctionProperty)) {
    return saveNodeToCollection(entity, context.collectedData.functionProperties);
  }
  if (EntityType.is(entity, EntityType.FunctionVariable)) {
    return saveNodeToCollection(entity, context.collectedData.functionVariables);
  }
};

const saveNodeToCollection = <
  E extends EntityType,
  NT extends SupportedNodeType
>(
  entity: Entity<E, NT>,
  collection: Entity<E, NT>[]
) => {
  if (!doesEntityAlreadyExists(collection, entity.id)) {
    collection.push(entity);
  }
};

const handleNodeDescendants = (entity: SupportedEntities, context: Context): void => {
  if (EntityType.is(entity, EntityType.Class)) {
    handleNodes(entity.node.getMembers(), context);
  }
};
