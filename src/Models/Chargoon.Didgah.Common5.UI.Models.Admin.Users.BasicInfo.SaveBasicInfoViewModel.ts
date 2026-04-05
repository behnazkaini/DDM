import { Person } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Users.BasicInfo.Person";
import { AuthenticationType } from "./Chargoon.Didgah.AuthenticationType";
import { ExtendedAuthenticationType } from "./Chargoon.Didgah.Common.Domain.Dto.User.ExtendedAuthenticationType";

export interface SaveBasicInfoViewModel {
  Person: Person;
  Guid: string;
  OperationGuid: string;
  Id: number;
  LanguageId: number;
  CalendarType: number;
  Theme: number;
  DefaultSoftwareGuid: string;
  AccessZoneId: number;
  FileSpace: number;
  BodyFileLimit: number;
  AttachmentLimit: number;
  MessageAttachmentLimit: number;
  MessageReceiversLimit: number;
  ActivityLimitedUser: boolean;
  ActivityLimitationDate: Date;
  Username: string;
  Password: string;
  PasswordShouldBeChanged: boolean;
  OTPRequired: boolean;
  TokenProfileName: string;
  IsOperationGuidChanged: boolean;
  AuthenticationType: AuthenticationType;
  ExtendedAuthenticationTypes: ExtendedAuthenticationType[];
}
