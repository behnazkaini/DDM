import { ValidationResult } from "./Chargoon.Didgah.Common5.UI.Models.DTS.ValidationResult";

export interface DTSProcessViewModel {
  SoftwareTitleKey: string;
  PackageTitleKey: string;
  StartDate: Date;
  RecordsCount: string;
  ValidRecordsCount: string;
  InvalidRecordsCount: string;
  ValidationResult: ValidationResult;
  TransformedRecordsCount: string;
  UntransformedRecordsCount: string;
}
