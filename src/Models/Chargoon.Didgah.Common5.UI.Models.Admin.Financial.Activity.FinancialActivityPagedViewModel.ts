import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { FinancialActivityViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Financial.Activity.FinancialActivityViewModel";

export interface FinancialActivityPagedViewModel {
  Data: FinancialActivityViewModel[];
  Total: number;
}
