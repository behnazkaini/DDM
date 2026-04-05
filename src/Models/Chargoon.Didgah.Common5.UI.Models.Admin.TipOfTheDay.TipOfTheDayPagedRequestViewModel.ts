import { IPagedRequest } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedRequest";
import { TipOfTheDayPagedRequestMetadataViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.TipOfTheDay.TipOfTheDayPagedRequestMetadataViewModel";
import { SortOrder } from "./Chargoon.Didgah.Core5.Components.Models.Common.SortOrder";

export interface TipOfTheDayPagedRequestViewModel {
  PageSize: number;
  PageIndex: number;
  Metadata: TipOfTheDayPagedRequestMetadataViewModel;
  SortField: string;
  SortOrder: SortOrder;
}
