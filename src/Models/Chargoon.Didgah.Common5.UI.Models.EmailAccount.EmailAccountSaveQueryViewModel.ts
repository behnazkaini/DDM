import { eOwnerFlag } from "./Chargoon.Didgah.Common.Domain.Enumeration.eOwnerFlag";

export interface EmailAccountSaveQueryViewModel {
  ID: number;
  Guid: string;
  DisplayName: string;
  FullName: string;
  EmailAddress: string;
  ReplyAddress: string;
  Pop3Server: string;
  Pop3AccountName: string;
  Pop3Password: string;
  Pop3PasswordConfirm: string;
  Pop3DeleteFromServer: boolean;
  SmtpServer: string;
  SmtpAccountName: string;
  SmtpPassword: string;
  SmtpPasswordConfirm: string;
  AutoSynchronize: boolean;
  AuthenticationMethod: number;
  MailServerType: number;
  IncomingServerEncryptedConnectionType: number;
  OutgoingServerEncryptedConnectionType: number;
  Pop3Port: number;
  SmtpPort: number;
  SmtpMaxSendPerMinute: number;
  RequireSecurePasswordAuthentication: boolean;
  OwnerGuid: string;
  OwnerFlag: eOwnerFlag;
  IsDefault: boolean;
  HourlySendLimit: number;
  DailySendLimit: number;
  IsSendable: boolean;
}
