import { TemplateDetailsInfoMap } from "./Chargoon.Didgah.Common5.UI.Models.DataMigration.TemplateDetailsInfoMap";

export interface TemplateSaveModel {
  Guid: string;
  Id: number;
  SoftwareGuid: string;
  EffectiveRow: number;
  Code: number;
  ReferenceFlag: number;
  TemplateName: string;
  Date: Date;
  Comments: string;
  MigrationTemplateFileId: string;
  TemplateDetailsInfoMaps: TemplateDetailsInfoMap[];
}
