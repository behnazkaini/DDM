import { TemplateDetailsInfoMap } from "./Chargoon.Didgah.Common5.UI.Models.DataMigration.TemplateDetailsInfoMap";

export interface TemplateDefineViewModel {
  ID: number;
  Guid: string;
  Code: string;
  TemplateName: string;
  Date: Date;
  ReferenceFlag: number;
  EffectiveRow: number;
  Comments: string;
  TemplateDetailsInfoMaps: TemplateDetailsInfoMap[];
}
