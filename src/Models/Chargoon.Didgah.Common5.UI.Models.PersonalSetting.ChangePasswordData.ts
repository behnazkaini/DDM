export interface ChangePasswordData {
  AuthenticationString: string;
  ChallengeString: string;
  ComplexPassword: string;
  PasswordLengthFailMessage: string;
  key: string;
  RSA_E: string;
  RSA_M: string;
}
