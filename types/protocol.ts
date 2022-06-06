import { ClassEntity, ClassStaticBlockEntity, ConstructorEntity, EnumEntity, FieldEntity, FileEntity, FunctionEntity, FunctionPropertyEntity, FunctionVariableEntity, GetterEntity, InterfaceEntity, MethodEntity, NamespaceEntity, SetterEntity, TypeEntity, VariableEntity } from "./entity";
import { Relation } from "./relation";

/**
 * The schema works in such way:
 * - Every array of entities contains all exists entites
 * - Relations array contains all exists relations between entities
 * - Every entity contains it's own list of direct relations
 */
export interface Protocol {
  files: FileEntity[];
  namespaces: NamespaceEntity[];
  classes: ClassEntity[];
  functions: FunctionEntity[];
  enums: EnumEntity[];
  interfaces: InterfaceEntity[];
  variables: VariableEntity[];
  types: TypeEntity[];
  relations: Relation[];
  // Additional entities
  constructors: ConstructorEntity[];
  setters: SetterEntity[];
  getters: GetterEntity[];
  methods: MethodEntity[];
  fields: FieldEntity[];
  classStaticBlocks: ClassStaticBlockEntity[];
  functionProperties: FunctionPropertyEntity[];
  functionVariables: FunctionVariableEntity[];
}

export function initProtocol(): Protocol {
  return {
    files: [],
    namespaces: [],
    classes: [],
    functions: [],
    enums: [],
    variables: [],
    interfaces: [],
    types: [],
    relations: [],
    constructors: [],
    setters: [],
    getters: [],
    methods: [],
    fields: [],
    classStaticBlocks: [],
    functionProperties: [],
    functionVariables: []
  };
}
