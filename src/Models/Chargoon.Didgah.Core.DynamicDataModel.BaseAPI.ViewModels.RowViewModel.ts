import { KeyValueViewModel } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.KeyValueViewModel";

export interface RowViewModel<TKey> {
  PrimaryKey: TKey;
  KeyValues: KeyValueViewModel<string, Object>[];
}
