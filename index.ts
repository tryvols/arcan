import { Project } from "ts-morph";
import { analyseArchitecture } from "./analyser";
import { parser } from "./parser";
import { reportResult } from "./report";
// import { RelationType } from "./protocol/relation";

const project = new Project({
  tsConfigFilePath: "tsconfig.json"
});

const architectureData = parser(project);
// architectureData.relations.forEach(({entity1, type, entity2}) => {
//   console.log(`${entity1.id.padEnd(40)} ${RelationType[type].padEnd(15)} ${entity2.id}`);
// });

const {graph, metrics} = analyseArchitecture(architectureData, {});
reportResult(graph, metrics);
