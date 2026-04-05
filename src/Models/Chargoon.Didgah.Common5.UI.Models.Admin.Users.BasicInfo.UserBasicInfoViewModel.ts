import { AuthenticationType } from "./Chargoon.Didgah.AuthenticationType";
import { ExtendedAuthenticationType } from "./Chargoon.Didgah.Common.Domain.Dto.User.ExtendedAuthenticationType";

export interface UserBasicInfoViewModel {
  PersonGuid: string;
  PersonTitle: string;
  Guid: string;
  Id: number;
  LanguageId: number;
  CalendarTypeId: number;
  ThemeId: number;
  KeyboardId: number;
  DefaultSoftwareGuid: string;
  AccessZoneId: number;
  AccessZoneTitle: string;
  FileSpace: number;
  BodyFileLimit: number;
  AttachmentLimit: number;
  MessageAttachmentLimit: number;
  MessageReceiversLimit: number;
  UserLimitation: boolean;
  LimitedUserDate: Date;
  Username: string;
  TokenProfileName: string;
  OperationGuid: string;
  OTPRequired: boolean;
  PasswordShouldBeChanged: boolean;
  AuthenticationType: AuthenticationType;
  ExtendedAuthenticationTypes: ExtendedAuthenticationType[];
}
