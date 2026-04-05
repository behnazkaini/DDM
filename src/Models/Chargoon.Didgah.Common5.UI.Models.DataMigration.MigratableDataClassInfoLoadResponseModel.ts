import { MigratableDataClassInfo } from "./Chargoon.Didgah.Common5.UI.Models.DataMigration.MigratableDataClassInfo";
import { ExcelColumn } from "./Chargoon.Didgah.Common5.UI.Models.DataMigration.ExcelColumn";

export interface MigratableDataClassInfoLoadResponseModel {
  ClassColumns: MigratableDataClassInfo[];
  ExcelColumns: ExcelColumn[];
}
