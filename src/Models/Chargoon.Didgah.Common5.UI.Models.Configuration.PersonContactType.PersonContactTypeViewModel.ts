import { PersonContactGeneralType } from "./Chargoon.Didgah.Common.Domain.Enumeration.PersonContactGeneralType";

export interface PersonContactTypeViewModel {
  Guid: string;
  Code: string;
  Title: string;
  Active: boolean;
  ShowInList: boolean;
  Type: PersonContactGeneralType;
  Deletable: boolean;
  TypeEditable: boolean;
}
