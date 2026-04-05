import { FiscalYearSoftwareStateViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Financial.FiscalYear.FiscalYearSoftwareStateViewModel";

export interface FiscalYearDetailEditViewModel {
  Guid: string;
  StartDate: Date;
  EndDate: Date;
  IsLock: boolean;
  SoftwareStates: FiscalYearSoftwareStateViewModel[];
}
