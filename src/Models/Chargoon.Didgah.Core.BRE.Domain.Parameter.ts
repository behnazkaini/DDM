import { TypeDefinition } from "./Chargoon.Didgah.Core.BRE.Domain.TypeDefinition";

export interface Parameter {
  Guid: string;
  Name: string;
  Type: TypeDefinition;
}
