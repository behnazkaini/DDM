import { ColumnDataType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import { BookmarkType } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.BookmarkType";

export interface ColumnViewModel {
  Guid: string;
  DataType: ColumnDataType;
  Name: string;
  Label: string;
  Setting: string;
  Bookmark: string;
  BookmarkType: BookmarkType;
}
