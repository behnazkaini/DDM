import { FiscalYearDetailState } from "./Chargoon.Didgah.Common.Domain.Enumeration.FiscalYearDetailState";

export interface FiscalYearSoftwareStateViewModel {
  ID: number;
  SoftwareGuid: string;
  FiscalYearDetailState: FiscalYearDetailState;
}
