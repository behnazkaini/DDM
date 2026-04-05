import { TemplatePlatformType } from "./Chargoon.Didgah.Common.Domain.Enumeration.DidgahMessenger.TemplatePlatformType";

export interface MessageTemplateSaveViewModel {
  Guid: string;
  EventGuid: string;
  Message: string;
  PlatformType: TemplatePlatformType;
  IsActive: boolean;
  UsedVariableKeys: string[];
}
