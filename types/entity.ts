import {
  ClassDeclaration,
  ClassStaticBlockDeclaration,
  ConstructorDeclaration,
  EnumDeclaration,
  FunctionDeclaration,
  GetAccessorDeclaration,
  InterfaceDeclaration,
  MethodDeclaration,
  ModuleDeclaration,
  PropertyDeclaration,
  SetAccessorDeclaration,
  SourceFile,
  TypeAliasDeclaration,
  VariableDeclaration
} from "ts-morph";

export enum EntityType {
  File = 1,
  Namespace = 2,
  Class = 3,
  Function = 4,
  Enum = 5,
  Interface = 6,
  Variable = 7,
  Type = 8,
  Method = 9,
  Constructor = 10,
  Field = 11,
  Getter = 12,
  Setter = 13,
  FunctionVariable = 14,
  ClassStaticBlock = 15,
  FunctionProperty = 16,
  Unknown = 17
}

export const validEntityTypesList = [
  EntityType.Field,
  EntityType.Namespace,
  EntityType.Class,
  EntityType.Function,
  EntityType.Enum,
  EntityType.Interface,
  EntityType.Variable,
  EntityType.Type,
  EntityType.Method,
  EntityType.Constructor,
  EntityType.Field,
  EntityType.Getter,
  EntityType.Setter,
  EntityType.FunctionVariable,
  EntityType.ClassStaticBlock,
  EntityType.FunctionProperty
];

export namespace EntityType {
  export type EntityTypeToEntity = {
    [key: number]: Entity<any, any>;
    [EntityType.File]: FileEntity;
    [EntityType.Namespace]: NamespaceEntity;
    [EntityType.Class]: ClassEntity;
    [EntityType.Function]: FunctionEntity;
    [EntityType.Enum]: EnumEntity;
    [EntityType.Interface]: InterfaceEntity;
    [EntityType.Variable]: VariableEntity;
    [EntityType.Type]: TypeEntity;
    [EntityType.Constructor]: ConstructorEntity;
    [EntityType.Setter]: SetterEntity;
    [EntityType.Getter]: GetterEntity;
    [EntityType.Method]: MethodEntity;
    [EntityType.Field]: FieldEntity;
    [EntityType.ClassStaticBlock]: ClassStaticBlockEntity;
    [EntityType.FunctionProperty]: FunctionPropertyEntity;
    [EntityType.FunctionVariable]: FunctionVariableEntity;
  };

  export const is = <PT extends keyof EntityTypeToEntity>(entity: Entity<any, any>, type: PT): entity is EntityTypeToEntity[PT] => {
    return entity.entityType == type;
  }
}

export type SupportedEntities =
  | FileEntity
  | NamespaceEntity
  | ClassEntity
  | FunctionEntity
  | EnumEntity
  | InterfaceEntity
  | VariableEntity
  | TypeEntity
  | ConstructorEntity
  | SetterEntity
  | GetterEntity
  | MethodEntity
  | FieldEntity
  | ClassStaticBlockEntity
  | FunctionPropertyEntity
  | FunctionVariableEntity;

export type SupportedCodeEntities = Exclude<SupportedEntities, FileEntity>;

export type SupportedNodeType =
  | ClassDeclaration
  | FunctionDeclaration
  | SourceFile
  | ModuleDeclaration
  | EnumDeclaration
  | InterfaceDeclaration
  | VariableDeclaration
  | TypeAliasDeclaration
  // Additional node types
  | ConstructorDeclaration
  | SetAccessorDeclaration
  | GetAccessorDeclaration
  | MethodDeclaration
  | PropertyDeclaration
  | ClassStaticBlockDeclaration;
export type SupportedCodeNodeType = Exclude<SupportedNodeType, SourceFile>;

export interface Entity<T extends EntityType, NodeType extends SupportedNodeType> {
  id: string; // Should be hash code
  name: string;
  node: NodeType;
  entityType: T;
  isInternal: boolean;
}

export interface CodeEntity<T extends EntityType, NodeType extends SupportedCodeNodeType> extends Entity<T, NodeType> {
  parentFile: FileEntity;
  parentFilePath: string;
}

/**
 * Base Entities declarations
 */
export interface NamespaceEntity extends CodeEntity<EntityType.Namespace, ModuleDeclaration> {}
export interface FileEntity extends Entity<EntityType.File, SourceFile> {
  path: string;
}
export interface ClassEntity extends CodeEntity<EntityType.Class, ClassDeclaration> {
  isAbstract: boolean;
}
export interface FunctionEntity extends CodeEntity<EntityType.Function, FunctionDeclaration> {}
export interface EnumEntity extends CodeEntity<EntityType.Enum, EnumDeclaration> {}
export interface InterfaceEntity extends CodeEntity<EntityType.Interface, InterfaceDeclaration> {}
export interface VariableEntity extends CodeEntity<EntityType.Variable, VariableDeclaration> {}
export interface TypeEntity extends CodeEntity<EntityType.Type, TypeAliasDeclaration> {}

/**
 * Additional Entities declarations
 */
export interface ConstructorEntity extends CodeEntity<EntityType.Constructor, ConstructorDeclaration> {}
export interface SetterEntity extends CodeEntity<EntityType.Setter, SetAccessorDeclaration> {}
export interface GetterEntity extends CodeEntity<EntityType.Getter, GetAccessorDeclaration> {}
export interface MethodEntity extends CodeEntity<EntityType.Method, MethodDeclaration> {}
export interface FieldEntity extends CodeEntity<EntityType.Field, PropertyDeclaration> {}
export interface ClassStaticBlockEntity extends CodeEntity<EntityType.ClassStaticBlock, ClassStaticBlockDeclaration> {}
export interface FunctionPropertyEntity extends CodeEntity<EntityType.FunctionProperty, PropertyDeclaration> {}
export interface FunctionVariableEntity extends CodeEntity<EntityType.FunctionVariable, VariableDeclaration> {}
