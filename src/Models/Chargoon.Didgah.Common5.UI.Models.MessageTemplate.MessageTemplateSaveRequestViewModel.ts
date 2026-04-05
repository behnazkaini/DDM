import { MessageTemplateSaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.MessageTemplate.MessageTemplateSaveViewModel";

export interface MessageTemplateSaveRequestViewModel {
  Added: MessageTemplateSaveViewModel[];
  Edited: MessageTemplateSaveViewModel[];
  Deleted: MessageTemplateSaveViewModel[];
}
