import { Node, ReferenceEntry, SyntaxKind } from "ts-morph";
import { Entity, FileEntity, SupportedCodeEntities } from "../types/entity";
import { Relation, RelationType } from "../types/relation";
import { containsFunction } from "./helpers/contains-function";
import { getEntityId } from "./helpers/get-entity-id";
import { getFilePath } from "./helpers/get-file-path";
import { getRelationId } from "./helpers/get-relation-id";
import { isExternalFileDependency } from "./helpers/is-external-dependency";
import { Context, GeneralContext } from "./types/context"

export const collectEntitiesRelations = (context: GeneralContext): void => {
  collectFilesRelations(context)(context.collectedData.files);

  [
    context.collectedData.namespaces,
    context.collectedData.classes,
    context.collectedData.functions,
    context.collectedData.enums,
    context.collectedData.interfaces,
    context.collectedData.variables,
    context.collectedData.types,
    context.collectedData.constructors,
    context.collectedData.fields,
    context.collectedData.functionProperties,
    context.collectedData.functionVariables,
    context.collectedData.getters,
    context.collectedData.setters,
    context.collectedData.methods,
    context.collectedData.classStaticBlocks
  ].forEach(
    collectCodeEntitiesCommonRelations(context)
  );
};

const collectFilesRelations = (context: GeneralContext) => (files: FileEntity[]): void => {
  files.forEach(file => {
    const imports = file.node.getImportDeclarations();

    imports.forEach(i => {
      const moduleSpecifier = i.getModuleSpecifier();
      const dependencyFile = i.getModuleSpecifierSourceFile();

      if (moduleSpecifier.getText() !== "console") {
        return;
      }

      if (!dependencyFile) {
        throw new Error(`Dependency doesn't exist:\n${moduleSpecifier.getText()}`);
      }

      // Ignore external dependencies
      if (!context.config.handleProjectDependencies && isExternalFileDependency(dependencyFile)) {
        return;
      }

      if (isExternalFileDependency(dependencyFile)) {
        // Should hanle this case
        // Collecting of all external entities should be handled by mappers
        return;
      }

      const dependencyFileName = getFilePath(dependencyFile);
      const dependencyFileEntity = files.find(f => f.path === dependencyFileName);

      if (!dependencyFileEntity) {
        console.warn(`Entity of the file ${dependencyFileName} doesn't exists`);
        return;
      }

      saveRelation({
        entity1: dependencyFileEntity,
        type: RelationType.UsedBy,
        entity2: file
      }, context);
    });
  });
};

const getPossibleParents = (parentNode: Node, context: GeneralContext): Entity<any, any>[] | undefined => {
  if (Node.is(SyntaxKind.SourceFile)(parentNode)) {
    return context.collectedData.files;
  }
  if (Node.is(SyntaxKind.ModuleDeclaration)(parentNode)) {
    return context.collectedData.namespaces;
  }
  if (Node.is(SyntaxKind.FunctionDeclaration)(parentNode)) {
    return context.collectedData.functions;
  }
  if (Node.is(SyntaxKind.ClassDeclaration)(parentNode)) {
    return context.collectedData.classes;
  }
  if (Node.is(SyntaxKind.EnumDeclaration)(parentNode)) {
    return context.collectedData.enums;
  }
  if (Node.is(SyntaxKind.InterfaceDeclaration)(parentNode)) {
    return context.collectedData.interfaces;
  }
  if (Node.is(SyntaxKind.TypeAliasDeclaration)(parentNode)) {
    return context.collectedData.types;
  }
  if (Node.is(SyntaxKind.MethodDeclaration)(parentNode)) {
    return context.collectedData.methods;
  }
  if (Node.is(SyntaxKind.Constructor)(parentNode)) {
    return context.collectedData.constructors;
  }
  if (Node.is(SyntaxKind.GetAccessor)(parentNode)) {
    return context.collectedData.getters;
  }
  if (Node.is(SyntaxKind.SetAccessor)(parentNode)) {
    return context.collectedData.setters;
  }
  if (Node.is(SyntaxKind.ClassStaticBlockDeclaration)(parentNode)) {
    return context.collectedData.classStaticBlocks;
  }
  if (Node.is(SyntaxKind.PropertyDeclaration)(parentNode)) {
    return containsFunction(parentNode)
      ? context.collectedData.functionProperties
      : context.collectedData.fields;
  }
  if (Node.is(SyntaxKind.VariableDeclaration)(parentNode)) {
    return containsFunction(parentNode)
      ? context.collectedData.functionVariables
      : context.collectedData.variables;
  }

  return undefined;
}

type CollectCascadingRelationsProps = {
  entity: SupportedCodeEntities;
  baseRelationNode?: Node;
  relationType: RelationType;
  context: GeneralContext;
};
/**
 * Collect entitites that are containers with any nesting level.
 * 
 * For example. If we have SomeModule -> SomeFunction -> SomeClass nesting, for SomeClass it will create relations:
 * - SomeModule -> SomeClass
 * - SomeFunction -> SomeClass
 */
const collectCascadingRelations = ({
  entity,
  baseRelationNode,
  relationType,
  context
}: CollectCascadingRelationsProps): void => {

  function addParentRelation(parentNode: Node): boolean {
    const parentId = getEntityId(parentNode);

    const possibleParents = getPossibleParents(parentNode, context);
    
    if (!possibleParents) {
      return false;
    }

    const parentEntity = possibleParents.find(p => p.id === parentId);
    
    if (!parentEntity) {
      console.warn(`Expected entity doesn't exist: ${parentId}`);
      return false;
    }

    saveRelation({
      entity1: entity,
      type: relationType,
      entity2: parentEntity
    }, context);

    return true;
  }

  let parent = baseRelationNode;
  while (parent) {
    if (addParentRelation(parent)) {
      return;
    }
    parent = parent.getParent();
  };
};

const collectContainerRelations = (entity: SupportedCodeEntities, context: GeneralContext): void => {
  collectCascadingRelations({
    entity,
    baseRelationNode: entity.node.getParent(),
    relationType: RelationType.ChidlrenOf,
    context
  });
};

const collectUsageRelations = (entity: SupportedCodeEntities, ref: ReferenceEntry, context: GeneralContext): void => {
  collectCascadingRelations({
    entity,
    baseRelationNode: ref.getNode(),
    relationType: RelationType.UsedBy,
    context
  });
};

const collectExtendsAndImplementsRelation = (
  entity: SupportedCodeEntities,
  ref: ReferenceEntry,
  context: GeneralContext
): boolean => {
  if (!Node.is(SyntaxKind.ClassDeclaration)(entity.node) && !Node.is(SyntaxKind.InterfaceDeclaration)(entity.node)) {
    return false;
  }

  const heritageClause = ref.getNode()?.getParent()?.getParent();
  if (!Node.is(SyntaxKind.HeritageClause)(heritageClause)) {
    return false;
  }

  const relationType =
    heritageClause.getText().includes("implements") ? RelationType.Implements :
    heritageClause.getText().includes("extends")    ? RelationType.Extends    : undefined;

  /**
   * Something here went wrong and for some reason heritage clause
   * contains something else of `implements` or `extends`
   */
  if (!relationType) {
    console.warn(`
      Heritage clause ${heritageClause.getText()} contains
      unexpected heritage type (should be 'implements' or 'extends')
    `);
    return false;
  }

  let parent = heritageClause.getParent();

  if (Node.is(SyntaxKind.ClassExpression)(parent)) {
    const parentDeclaration = parent.getParent();

    /**
     * Here may be a gap with anonymous classes used as parameters (ClassExpression not saved to a variable).
     * For now we ingoring these cases.
     */
    if (!Node.is(SyntaxKind.VariableDeclaration)(parentDeclaration)) {
      return false;
    }

    const entityId = getEntityId(parentDeclaration);
    const extendsEntity = context.collectedData.variables.find(v => v.id === entityId);

    if (!extendsEntity) {
      console.warn(`Variable entity ${entityId} doesn't exist!`);
      return false;
    }

    saveRelation({
      entity1: extendsEntity,
      type: relationType,
      entity2: entity
    }, context);

    return true;
  }

  const entityId = getEntityId(parent);

  let extendsEntity = Node.is(SyntaxKind.ClassDeclaration)(parent)
    ? context.collectedData.classes.find(c => c.id === entityId)
    : context.collectedData.interfaces.find(f => f.id === entityId);

  if (!extendsEntity) {
    console.warn(`Entity ${entityId} doesn't exists!`, 'here');
    return false;
  }

  saveRelation({
    entity1: extendsEntity,
    type: relationType,
    entity2: entity
  }, context);

  return true;
};

const collectCodeEntitiesCommonRelations = (context: GeneralContext) => (entities: SupportedCodeEntities[]): void => {
  entities.forEach(entity => {
    collectContainerRelations(entity, context);

    if (Node.is(SyntaxKind.ClassStaticBlockDeclaration)(entity.node)) {
      return;
    }

    entity.node.findReferences().forEach(r => {
      r.getReferences().forEach(ref => {
        if (ref.isDefinition()) {
          return;
        }

        return collectExtendsAndImplementsRelation(entity, ref, context)
            || collectUsageRelations(entity, ref,context);
      });
    });
  });
};

const saveRelation = (relation: Omit<Relation, "id">, context: Context): void => {
  const {relations} = context.collectedData;
  const id = getRelationId(relation);

  if (!relations.some(rel => getRelationId(rel) === id)) {
    relations.push({...relation, id});
  }
}
