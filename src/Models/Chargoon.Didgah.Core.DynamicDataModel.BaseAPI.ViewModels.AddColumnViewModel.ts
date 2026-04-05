import { ColumnDataType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import { BookmarkType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.BookmarkType";

export class AddColumnViewModel {
  Guid: string;
  Name: string;
  DataType: ColumnDataType;
  Setting: string;
  Label: string;
  Bookmark: string;
  BookmarkType: BookmarkType;
}
