import { FiscalYearSoftwareStateViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Financial.FiscalYear.FiscalYearSoftwareStateViewModel";

export interface FiscalYearDetailViewModel {
  Guid: string;
  StartDate: Date;
  EndDate: Date;
  AddedSoftwareStates: FiscalYearSoftwareStateViewModel[];
  EditedSoftwareStates: FiscalYearSoftwareStateViewModel[];
  DeletedSoftwareStates: FiscalYearSoftwareStateViewModel[];
}
