import { DataModelSettingViewModel } from "../../..//Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModel.Settings.DataModelSettingViewModel";
import { RelationNature } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { RelationType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import GraphModel from "./GraphModel";

export interface SettingViewModel extends DataModelSettingViewModel {
  Value?: any
}

export default interface Relation extends GraphModel {
  guid: string;
  tableGuid: string;
  referencedTableGuid: string;
  relationType: RelationType;
  relationNature: RelationNature;
  label: string;
  bookmark: string;
  editable: boolean
  name: string;
  bookmarkType: number;
  settings?: SettingViewModel[]
} 