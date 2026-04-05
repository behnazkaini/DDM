import { MyDidgahSoftwareWidgetSize } from "./Chargoon.Didgah.Common.Domain.Enumeration.MyDidgahSoftwareWidgetSize";

export interface MyDidgahSoftwareWidgetViewModel {
  Guid: string;
  SoftwareGuid: string;
  Title: string;
  WidgetSize: MyDidgahSoftwareWidgetSize;
}
