import { ColumnDataType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import { DataModel } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Dtos.DataModel";

export class Column {
  Guid: string;
  DataType: ColumnDataType;
  DataModel: DataModel;
  Name: string;
  Label: string;
  Setting: string;
  Bookmark: string;
}
