import { EntityType } from "./entity";
import { RelationType } from "./relation";

export interface GraphRelation {
  id: string;
  node1: GraphNode<EntityType>;
  node2: GraphNode<EntityType>;
  type: RelationType;
}

export interface GraphRelationsOwner {
  relations: GraphRelation[];
}

export interface GraphNode<T extends EntityType> extends GraphRelationsOwner {
  id: string;
  name: string;
  entityType: T;
  isInternal: boolean;
}

export interface GraphCodeNode<T extends Exclude<EntityType, EntityType.File>> extends GraphNode<T> {
  parentFile: FileGraphNode;
}

export interface FileGraphNode extends GraphNode<EntityType.File> {
  path: string;
}
export interface NamespaceGraphNode extends GraphCodeNode<EntityType.Namespace> {}
export interface ClassGraphNode extends GraphCodeNode<EntityType.Class> {
  isAbstract: boolean;
}
export interface FunctionGraphNode extends GraphCodeNode<EntityType.Function> {}
export interface EnumGraphNode extends GraphCodeNode<EntityType.Enum> {}
export interface InterfaceGraphNode extends GraphCodeNode<EntityType.Interface> {}
export interface VariableGraphNode extends GraphCodeNode<EntityType.Variable> {}
export interface TypeGraphNode extends GraphCodeNode<EntityType.Type> {}
export interface ConstructorGraphNode extends GraphCodeNode<EntityType.Constructor> {}
export interface MethodGraphNode extends GraphCodeNode<EntityType.Method> {}
export interface FieldGraphNode extends GraphCodeNode<EntityType.Field> {}
export interface FunctionPropertyGraphNode extends GraphCodeNode<EntityType.FunctionProperty> {}
export interface FunctionVariableGraphNode extends GraphCodeNode<EntityType.FunctionVariable> {}
export interface GetterGraphNode extends GraphCodeNode<EntityType.Getter> {}
export interface SetterGraphNode extends GraphCodeNode<EntityType.Setter> {}
export interface ClassStaticBlockGraphNode extends GraphCodeNode<EntityType.ClassStaticBlock> {}

export type SupportedGraphNodes =
  | FileGraphNode
  | NamespaceGraphNode
  | ClassGraphNode
  | FunctionGraphNode
  | EnumGraphNode
  | InterfaceGraphNode
  | VariableGraphNode
  | TypeGraphNode
  | ConstructorGraphNode
  | MethodGraphNode
  | FieldGraphNode
  | FunctionPropertyGraphNode
  | FunctionVariableGraphNode
  | GetterGraphNode
  | SetterGraphNode
  | ClassStaticBlockGraphNode;

export const EntityGroupsNames = {
  [EntityType.Class]: "Classes",
  [EntityType.ClassStaticBlock]: "Class Static Blocks",
  [EntityType.Constructor]: "Constructors",
  [EntityType.Enum]: "Enums",
  [EntityType.Field]: "Class Fields",
  [EntityType.File]: "Files",
  [EntityType.Function]: "Functions",
  [EntityType.FunctionProperty]: "Class Function Properties",
  [EntityType.FunctionVariable]: "Function Variables",
  [EntityType.Getter]: "Getters",
  [EntityType.Interface]: "Interfaces",
  [EntityType.Method]: "Methods",
  [EntityType.Namespace]: "Namespaces",
  [EntityType.Setter]: "Setters",
  [EntityType.Type]: "Types",
  [EntityType.Variable]: "Variables",
  [EntityType.Unknown]: ""
};

/**
 * Every node has relations to other related nodes.
 * Also the graph entity contains all of the relation into a single field to make it easier
 * search operations.
 */
export interface Graph extends GraphRelationsOwner {
  files: FileGraphNode[];
  namespaces: NamespaceGraphNode[];
  classes: ClassGraphNode[];
  functions: FunctionGraphNode[];
  enums: EnumGraphNode[];
  interfaces: InterfaceGraphNode[];
  variables: VariableGraphNode[];
  types: TypeGraphNode[];
  constructors: ConstructorGraphNode[];
  methods: MethodGraphNode[];
  fields: FieldGraphNode[];
  functionProperties: FunctionPropertyGraphNode[];
  functionVariables: FunctionVariableGraphNode[];
  getters: GetterGraphNode[];
  setters: SetterGraphNode[];
  classStaticBlocks: ClassStaticBlockGraphNode[];
  allNodes: SupportedGraphNodes[];
}