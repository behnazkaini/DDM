import { Method } from "./Chargoon.Didgah.Core.BRE.Domain.Method";
import { Property } from "./Chargoon.Didgah.Core.BRE.Domain.Property";

export interface Entity {
  Guid: string;
  Name: string;
  Methods: Method[];
  Properties: Property[];
}
