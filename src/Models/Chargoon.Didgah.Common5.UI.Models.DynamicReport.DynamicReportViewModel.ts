import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";
import { DynamicReportOperation } from "./Chargoon.Didgah.Common.Domain.Enumeration.DynamicReportOperation";

export class DynamicReportViewModel {
  FieldName: string;
  Caption: string;
  InMaster: boolean;
  InDetail: boolean;
  Order: SortOrder;
  Operation: DynamicReportOperation;
}
