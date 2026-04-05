import { DataModelSettingViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.DataModel.Settings.DataModelSettingViewModel";
import { RelationNature } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationNature";
import { RelationType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RelationType";
import GraphModel from "./GraphModel";
import { SettingViewModel } from "./Relation";

export default interface LinkData extends GraphModel {
  key: string;
  from: string;
  to: string;
  fromLabel: string;
  toLabel: string;
  relationType: RelationType;
  relationNature: RelationNature;
  added: boolean;
  label: string;
  bookmark: string;
  editable: boolean;
  deletable: boolean;
  name: string;
  bookmarkType: number;
  settings?: SettingViewModel[]
}