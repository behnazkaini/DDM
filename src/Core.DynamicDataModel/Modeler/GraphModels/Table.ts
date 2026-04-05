import { DataModelSettingViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModel.Settings.DataModelSettingViewModel";
import Column from "./Column";
import GraphModel from "./GraphModel";
import Relation from "./Relation";

export default interface Table extends GraphModel {
  key: string;
  guid: string;
  name: string;
  label: string;
  columns: Column[];
  relations: Relation[];
  // soft editable tell us we can edit fields like label or not.
  softEditable: boolean;
  // hard editable prevent us from editing any fields(hard editable priority > soft editable priority). 
  hardEditable: boolean;
  deletable: boolean;
  selected: boolean;
  added: boolean;
  softwareGuid: string;
  scopeGuid: string;
  isNew: boolean;
  dataModelType: number;
  settings?: DataModelSettingViewModel[]
}