import { TemplatePlatformType } from "./Chargoon.Didgah.Common.Domain.Enumeration.DidgahMessenger.TemplatePlatformType";

export interface MessageTemplateGetRequestViewModel {
  EventGuid: string;
  PlatformType: TemplatePlatformType;
}
