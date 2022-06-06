import {
  ClassDeclaration,
  ClassStaticBlockDeclaration,
  Constructor,
  ConstructorDeclaration,
  EnumDeclaration,
  FunctionDeclaration,
  GetAccessorDeclaration,
  InterfaceDeclaration,
  MethodDeclaration,
  ModuleDeclaration,
  Node,
  PropertyDeclaration,
  SetAccessorDeclaration,
  SourceFile,
  SyntaxKind,
  TypeAliasDeclaration,
  VariableDeclaration
} from "ts-morph";
import {
  ClassEntity,
  ClassStaticBlockEntity,
  ConstructorEntity,
  EntityType,
  EnumEntity,
  FieldEntity,
  FileEntity,
  FunctionEntity,
  FunctionPropertyEntity,
  FunctionVariableEntity,
  GetterEntity,
  InterfaceEntity,
  MethodEntity,
  NamespaceEntity,
  SetterEntity,
  TypeEntity,
  VariableEntity
} from "../types/entity";
import { getEntityId } from "./helpers/get-entity-id";
import { getNodeNameOrKindName } from "./helpers/get-node-name";
import { getFilePath } from "./helpers/get-file-path";
import { CodeEntityContext, GeneralContext, PossibleContexts } from "./types/context";
import { BaseCodeEntityMapper, BaseEntityMapper, Mapper } from "./types/mapper";
import { containsFunction } from "./helpers/contains-function";

/**
 * Base mappers
 */
const baseEntityMapper: BaseEntityMapper = (entityType, node) => {
  return {
    id: getEntityId(node),
    name: getNodeNameOrKindName(node),
    entityType,
    node,
    isInternal: true
  };
};

const baseCodeEntityMapper: BaseCodeEntityMapper = (entityType, node, context) => {
  return {
    ...baseEntityMapper(entityType, node, context),
    parentFile: context.parentFile,
    parentFilePath: getFilePath(context.parentFile.node),
  };
};

/**
 * Entity mappers
 */
export const classMapper: Mapper<ClassDeclaration, ClassEntity, CodeEntityContext> = (node, context) => {
  const isAbstract = node.isAbstract();

  return {
    ...baseCodeEntityMapper(EntityType.Class, node, context),
    isAbstract
  };
};
export const enumMapper: Mapper<EnumDeclaration, EnumEntity, CodeEntityContext> = (node, context) => {
  return baseCodeEntityMapper(EntityType.Enum, node, context);
};
export const fileMapper: Mapper<SourceFile, FileEntity, GeneralContext> = (node, context) => {
  const file = baseEntityMapper(EntityType.File, node, context);

  return {
    ...file,
    path: getFilePath(file.node)
  };
};
export const namespaceMapper: Mapper<ModuleDeclaration, NamespaceEntity, CodeEntityContext> = (node, context) => {
  return baseCodeEntityMapper(EntityType.Namespace, node, context);
};
export const functionMapper: Mapper<FunctionDeclaration, FunctionEntity, CodeEntityContext> = (node, context) => {
  return baseCodeEntityMapper(EntityType.Function, node, context);
};
export const interfaceMapper: Mapper<InterfaceDeclaration, InterfaceEntity, CodeEntityContext> = (node, context) => {
  return baseCodeEntityMapper(EntityType.Interface, node, context);
}
export const variableMapper: Mapper<VariableDeclaration, VariableEntity, CodeEntityContext> = (node, context) => {
  /**
   * Variables may contain:
   * - FunctionExpression
   * - ClassExpression
   * 
   * And we should map them as their real types.
   * For now to simplifying a MWP version, will work with it as variables, however, in advance
   * it should be fixed and handled as function & classes (nor variables).
   */
  return baseCodeEntityMapper(EntityType.Variable, node, context);
}
export const typeMapper: Mapper<TypeAliasDeclaration, TypeEntity, CodeEntityContext> = (node, context) => {
  return baseCodeEntityMapper(EntityType.Type, node, context);
}

/**
 * Additional entities mappers
 */
export const constructorMapper: Mapper<ConstructorDeclaration, ConstructorEntity, CodeEntityContext> = (node, context) => {
  return baseCodeEntityMapper(EntityType.Constructor, node, context);
}
export const setterMapper: Mapper<SetAccessorDeclaration, SetterEntity, CodeEntityContext> = (node, context) => {
  return baseCodeEntityMapper(EntityType.Setter, node, context);
}
export const getterMapper: Mapper<GetAccessorDeclaration, GetterEntity, CodeEntityContext> = (node, context) => {
  return baseCodeEntityMapper(EntityType.Getter, node, context);
}
export const methodMapper: Mapper<MethodDeclaration, MethodEntity, CodeEntityContext> = (node, context) => {
  return baseCodeEntityMapper(EntityType.Method, node, context);
}
export const fieldMapper: Mapper<PropertyDeclaration, FieldEntity, CodeEntityContext> = (node, context) => {
  return baseCodeEntityMapper(EntityType.Field, node, context);
}
export const classStaticBlockMapper: Mapper<ClassStaticBlockDeclaration, ClassStaticBlockEntity, CodeEntityContext> = (node, context) => {
  return baseCodeEntityMapper(EntityType.ClassStaticBlock, node, context);
}
export const functionPropertyMapper: Mapper<PropertyDeclaration, FunctionPropertyEntity, CodeEntityContext> = (node, context) => {
  return baseCodeEntityMapper(EntityType.FunctionProperty, node, context);
}
export const functionVariableMapper: Mapper<VariableDeclaration, FunctionVariableEntity, CodeEntityContext> = (node, context) => {
  return baseCodeEntityMapper(EntityType.FunctionVariable, node, context);
}

/**
 * Mappers adapter
 */
export const nodeToEntity = (node: Node, context: PossibleContexts) => {
  if (Node.is(SyntaxKind.SourceFile)(node)) {
    return fileMapper(node, context as GeneralContext);
  }
  if (Node.is(SyntaxKind.ModuleDeclaration)(node)) {
    return namespaceMapper(node, context as CodeEntityContext);
  }
  if (Node.is(SyntaxKind.FunctionDeclaration)(node)) {
    return functionMapper(node, context as CodeEntityContext);
  }
  if (Node.is(SyntaxKind.InterfaceDeclaration)(node)) {
    return interfaceMapper(node, context as CodeEntityContext);
  }
  if (Node.is(SyntaxKind.TypeAliasDeclaration)(node)) {
    return typeMapper(node, context as CodeEntityContext);
  }
  if (Node.is(SyntaxKind.VariableDeclaration)(node)) {
    if (containsFunction(node)) {
      return functionVariableMapper(node, context as CodeEntityContext);
    }

    return variableMapper(node, context as CodeEntityContext);
  }
  if (Node.is(SyntaxKind.ClassDeclaration)(node)) {
    return classMapper(node, context as CodeEntityContext);
  }
  if (Node.is(SyntaxKind.EnumDeclaration)(node)) {
    return enumMapper(node, context as CodeEntityContext);
  }
  /**
   * Additional entities
   */
  if (Node.is(SyntaxKind.Constructor)(node)) {
    return constructorMapper(node, context as CodeEntityContext);
  }
  if (Node.is(SyntaxKind.SetAccessor)(node)) {
    return setterMapper(node, context as CodeEntityContext);
  }
  if (Node.is(SyntaxKind.GetAccessor)(node)) {
    return getterMapper(node, context as CodeEntityContext);
  }
  if (Node.is(SyntaxKind.MethodDeclaration)(node)) {
    return methodMapper(node, context as CodeEntityContext);
  }
  if (Node.is(SyntaxKind.PropertyDeclaration)(node)) {
    if (containsFunction(node)) {
      return functionPropertyMapper(node, context as CodeEntityContext);
    }

    return fieldMapper(node, context as CodeEntityContext);
  }
  if (Node.is(SyntaxKind.ClassStaticBlockDeclaration)(node)) {
    return classStaticBlockMapper(node, context as CodeEntityContext);
  }

  return null;
};
