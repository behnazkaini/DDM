import { RowViewModelWithGuidKey } from "./Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.RowViewModelWithGuidKey";
import { RowState } from "./Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.RowState";

export interface SaveRowViewModel extends RowViewModelWithGuidKey {
  State: RowState;
}
