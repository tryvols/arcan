import { Protocol } from "../types/protocol";
import {
  ClassEntity,
  ClassStaticBlockEntity,
  CodeEntity,
  ConstructorEntity,
  Entity,
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
  SupportedCodeNodeType,
  SupportedNodeType,
  TypeEntity,
  VariableEntity
} from "../types/entity";
import {
  ClassGraphNode,
  ClassStaticBlockGraphNode,
  ConstructorGraphNode,
  EnumGraphNode,
  FieldGraphNode,
  FileGraphNode,
  FunctionGraphNode,
  FunctionPropertyGraphNode,
  FunctionVariableGraphNode,
  GetterGraphNode,
  Graph,
  GraphCodeNode,
  GraphNode,
  GraphRelation,
  InterfaceGraphNode,
  MethodGraphNode,
  NamespaceGraphNode,
  SetterGraphNode,
  SupportedGraphNodes,
  TypeGraphNode,
  VariableGraphNode
} from "../types/graph";

export function buildGraph(protocol: Protocol): Graph {
  const nodes = prepareGraphNodes(protocol);
  return prepareRelations(nodes, protocol);
}

/**
 * =================================
 * == Prepare Graph Nodes Section ==
 * =================================
 */
const prepareGraphNodes = (protocol: Protocol): Omit<Graph, "relations"> => {
  const files = protocol.files.map(fileEntityToGraphNode);
  const namespaces = protocol.namespaces.map(namespaceEntityToGraphNode(files));
  const classes = protocol.classes.map(classEntityToGraphNode(files));
  const functions = protocol.functions.map(functionEntityToGraphNode(files));
  const interfaces = protocol.interfaces.map(interfaceEntityToGraphNode(files));
  const enums = protocol.enums.map(enumEntityToGraphNode(files));
  const variables = protocol.variables.map(variableEntityToGraphNode(files));
  const types = protocol.types.map(typeEntityToGraphNode(files));
  const constructors = protocol.constructors.map(constructorEntityToGraphNode(files));
  const methods = protocol.methods.map(methodEntityToGraphNode(files));
  const fields = protocol.fields.map(fieldEntityToGraphNode(files));
  const functionProperties = protocol.functionProperties.map(functionPropertyEntityToGraphNode(files));
  const functionVariables = protocol.functionVariables.map(functionVariableEntityToGraphNode(files));
  const getters = protocol.getters.map(getterEntityToGraphNode(files));
  const setters = protocol.setters.map(setterEntityToGraphNode(files));
  const classStaticBlocks = protocol.classStaticBlocks.map(classStaticBlockToGraphNode(files))

  return {
    files,
    namespaces,
    classes,
    functions,
    interfaces,
    enums,
    variables,
    types,
    constructors,
    methods,
    fields,
    functionProperties,
    functionVariables,
    getters,
    setters,
    classStaticBlocks,
    allNodes: [
      ...files,
      ...namespaces,
      ...classes,
      ...functions,
      ...interfaces,
      ...enums,
      ...variables,
      ...types,
      ...constructors,
      ...methods,
      ...fields,
      ...functionProperties,
      ...functionVariables,
      ...getters,
      ...setters,
      ...classStaticBlocks
    ]
  };
}

/**
 * Entity to graph node transformers
 */
function baseEntityToGraphNode<T extends EntityType>(entity: Entity<T, SupportedNodeType>): GraphNode<T> {
  return {
    id: entity.id,
    entityType: entity.entityType,
    name: entity.name,
    isInternal: entity.isInternal,
    relations: []
  };
}

const baseCodeEntityToGraphNode = <T extends Exclude<EntityType, EntityType.File>>(
  entity: CodeEntity<T, SupportedCodeNodeType>,
  files: FileGraphNode[]
): GraphCodeNode<T> => {
  const parentFile = files.find(f => f.id === entity.parentFile.id);

  if (!parentFile) {
    throw new Error("Parent file should exists for any code entity!");
  }

  return {
    ...baseEntityToGraphNode(entity),
    parentFile: parentFile as FileGraphNode
  };
}

const fileEntityToGraphNode = (entity: FileEntity): FileGraphNode => {
  return {
    ...baseEntityToGraphNode(entity),
    path: entity.path
  };
}
const namespaceEntityToGraphNode = (files: FileGraphNode[]) => (entity: NamespaceEntity): NamespaceGraphNode => {
  return baseCodeEntityToGraphNode(entity, files);
}
const classEntityToGraphNode = (files: FileGraphNode[]) => (entity: ClassEntity): ClassGraphNode => {
  return {
    ...baseCodeEntityToGraphNode(entity, files),
    isAbstract: entity.isAbstract
  };
}
const functionEntityToGraphNode = (files: FileGraphNode[]) => (entity: FunctionEntity): FunctionGraphNode => {
  return baseCodeEntityToGraphNode(entity, files);
}
const interfaceEntityToGraphNode = (files: FileGraphNode[]) => (entity: InterfaceEntity): InterfaceGraphNode => {
  return baseCodeEntityToGraphNode(entity, files);
}
const enumEntityToGraphNode = (files: FileGraphNode[]) => (entity: EnumEntity): EnumGraphNode => {
  return baseCodeEntityToGraphNode(entity, files);
}
const variableEntityToGraphNode = (files: FileGraphNode[]) => (entity: VariableEntity): VariableGraphNode => {
  return baseCodeEntityToGraphNode(entity, files);
}
const typeEntityToGraphNode = (files: FileGraphNode[]) => (entity: TypeEntity): TypeGraphNode => {
  return baseCodeEntityToGraphNode(entity, files);
}
const constructorEntityToGraphNode = (files: FileGraphNode[]) => (entity: ConstructorEntity): ConstructorGraphNode => {
  return baseCodeEntityToGraphNode(entity, files);
}
const methodEntityToGraphNode = (files: FileGraphNode[]) => (entity: MethodEntity): MethodGraphNode => {
  return baseCodeEntityToGraphNode(entity, files);
}
const fieldEntityToGraphNode = (files: FileGraphNode[]) => (entity: FieldEntity): FieldGraphNode => {
  return baseCodeEntityToGraphNode(entity, files);
}
const functionPropertyEntityToGraphNode = (files: FileGraphNode[]) => (entity: FunctionPropertyEntity): FunctionPropertyGraphNode => {
  return baseCodeEntityToGraphNode(entity, files);
}
const functionVariableEntityToGraphNode = (files: FileGraphNode[]) => (entity: FunctionVariableEntity): FunctionVariableGraphNode => {
  return baseCodeEntityToGraphNode(entity, files);
}
const getterEntityToGraphNode = (files: FileGraphNode[]) => (entity: GetterEntity): GetterGraphNode => {
  return baseCodeEntityToGraphNode(entity, files);
}
const setterEntityToGraphNode = (files: FileGraphNode[]) => (entity: SetterEntity): SetterGraphNode => {
  return baseCodeEntityToGraphNode(entity, files);
}
const classStaticBlockToGraphNode = (files: FileGraphNode[]) => (entity: ClassStaticBlockEntity): ClassStaticBlockGraphNode => {
  return baseCodeEntityToGraphNode(entity, files);
}
/**
 * ===============================
 * == Prepare Relations Section ==
 * ===============================
 */
const prepareRelations = (nodes: Omit<Graph, "relations">, protocol: Protocol): Graph => {
  const relations: GraphRelation[] = protocol.relations.map(({id, entity1, entity2, type}) => {
    const node1 = nodes.allNodes.find(n => entity1.id === n.id);
    const node2 = nodes.allNodes.find(n => entity2.id === n.id);

    if (!node1 || !node2) {
      throw new Error ("Some nodes didn't find from relations!");
    }

    return {id, node1, type, node2};
  });

  const getNodeRelations = <T extends GraphNode<EntityType>>(node: T): T => {
    node.relations = relations.filter(rel => rel.node1.id === node.id || rel.node2.id === node.id);
    return node;
  };

  return {
    files: nodes.files.map(getNodeRelations),
    namespaces: nodes.namespaces.map(getNodeRelations),
    classes: nodes.classes.map(getNodeRelations),
    functions: nodes.functions.map(getNodeRelations),
    interfaces: nodes.interfaces.map(getNodeRelations),
    enums: nodes.enums.map(getNodeRelations),
    variables: nodes.variables.map(getNodeRelations),
    types: nodes.types.map(getNodeRelations),
    methods: nodes.methods.map(getNodeRelations),
    constructors: nodes.constructors.map(getNodeRelations),
    fields: nodes.fields.map(getNodeRelations),
    functionProperties: nodes.functionProperties.map(getNodeRelations),
    functionVariables: nodes.functionVariables.map(getNodeRelations),
    getters: nodes.getters.map(getNodeRelations),
    setters: nodes.setters.map(getNodeRelations),
    classStaticBlocks: nodes.classStaticBlocks.map(getNodeRelations),
    allNodes: nodes.allNodes,
    relations
  };
}
