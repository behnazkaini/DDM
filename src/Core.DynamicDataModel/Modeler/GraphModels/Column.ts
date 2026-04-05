import { ColumnDataType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.ColumnDataType";
import GraphModel from "./GraphModel";

export default interface Column extends GraphModel {
  key: string;
  name: string;
  dataType: ColumnDataType;
  editable: boolean;
  setting: any;
  label: string;
  bookmark: string;
  added: boolean;
  selected?: boolean;
  tableKey: string;
  guid?: string;
  bookmarkType:number;
}