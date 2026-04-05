import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";

export interface LogFilterInitViewModel {
  Actions: GenericKeyValuePair<number>[];
  Properties: GenericKeyValuePair<number>[];
  Conditions: GenericKeyValuePair<number>[];
}
