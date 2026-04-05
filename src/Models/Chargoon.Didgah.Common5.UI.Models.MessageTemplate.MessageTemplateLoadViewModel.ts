import { TemplatePlatformType } from "./Chargoon.Didgah.Common.Domain.Enumeration.DidgahMessenger.TemplatePlatformType";

export interface MessageTemplateLoadViewModel {
  Guid: string;
  EventGuid: string;
  Message: string;
  PlatformType: TemplatePlatformType;
  UsedVariableKeys: string[];
  IsActive: boolean;
}
