import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { TipOfTheDayViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.TipOfTheDay.TipOfTheDayViewModel";

export interface TipOfTheDayPagedResponseViewModel {
  Data: TipOfTheDayViewModel[];
  Total: number;
}
