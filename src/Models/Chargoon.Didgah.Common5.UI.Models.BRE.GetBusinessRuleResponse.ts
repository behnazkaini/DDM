import { Entity } from "./Chargoon.Didgah.Core.BRE.Domain.Entity";

export interface GetBusinessRuleResponse {
  CodeXml: string;
  Namespace: string;
  Entities: Entity[];
}
