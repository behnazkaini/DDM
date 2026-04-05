import { PersonViewModelBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonViewModelBase";

export class LegalPersonViewModel extends PersonViewModelBase {
  CompanyName: string;
  OldCompanyName: string;
  EconomicCode: string;
  RegisterNumber: string;
  SupplyStatus: string;
  SupplyStatusGuid: string;
  StockStatus: string;
  StockStatusGuid: string;
  OwnershipType: string;
  OwnershipTypeGuid: string;
  CompanyRegistrationDate: Date;
  EconomicalUniqueId: string;
  PrimaryWorkshopCode:number;
  SubWorkshopCode:number;
}
