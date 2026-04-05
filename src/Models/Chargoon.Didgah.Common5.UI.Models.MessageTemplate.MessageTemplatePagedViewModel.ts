import { IPagedResponse } from "./Chargoon.Didgah.Core5.Components.Models.TableEx.IPagedResponse";
import { MessageTemplateLoadViewModel } from "./Chargoon.Didgah.Common5.UI.Models.MessageTemplate.MessageTemplateLoadViewModel";

export interface MessageTemplatePagedViewModel {
  Data: MessageTemplateLoadViewModel[];
  Total: number;
}
