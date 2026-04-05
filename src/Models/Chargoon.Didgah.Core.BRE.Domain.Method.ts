import { Parameter } from "./Chargoon.Didgah.Core.BRE.Domain.Parameter";
import { TypeDefinition } from "./Chargoon.Didgah.Core.BRE.Domain.TypeDefinition";

export interface Method {
  Guid: string;
  Name: string;
  Parameters: Parameter[];
  ReturnType: TypeDefinition;
}
