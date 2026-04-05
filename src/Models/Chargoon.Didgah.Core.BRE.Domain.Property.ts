import { TypeDefinition } from "./Chargoon.Didgah.Core.BRE.Domain.TypeDefinition";

export interface Property {
  Guid: string;
  Name: string;
  Type: TypeDefinition;
}
