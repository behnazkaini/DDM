import { PersonFilterViewModelBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonFilterViewModelBase";

export interface LegalPersonFilterViewModel extends PersonFilterViewModelBase {
  CompanyName: string;
  RegisterNumber: string;
  OldCompanyName: string;
  EconomicCode: string;
  EconomicalUniqueIdentifier: string;
  SupplyStatusGuid: string;
  StockStatusGuid: string;
  OwnershipTypeGuid: string;
}
