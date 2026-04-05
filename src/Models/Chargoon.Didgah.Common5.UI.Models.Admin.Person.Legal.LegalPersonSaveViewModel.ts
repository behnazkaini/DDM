import { PersonSaveViewModelBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonSaveViewModelBase";

export interface LegalPersonSaveViewModel extends PersonSaveViewModelBase {
  CompanyName: string;
  OldCompanyName: string;
  EconomicCode: string;
  RegisterNumber: string;
  SupplyStatusGuid: string;
  StockStatusGuid: string;
  OwnershipTypeGuid: string;
  CompanyRegistrationDate: Date;
  EconomicalUniqueIdentifier: string;
  PrimaryWorkshopCode:number;
  SubWorkshopCode:number
}
