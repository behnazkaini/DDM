export interface EmailChangePasswordViewModel {
  ID: number;
  Pop3CurrentPassword: string;
  Pop3Password: string;
  Pop3PasswordConfirm: string;
  AuthenticationMethod: number;
  SmtpCurrentPassword: string;
  SmtpPassword: string;
  SmtpPasswordConfirm: string;
}
