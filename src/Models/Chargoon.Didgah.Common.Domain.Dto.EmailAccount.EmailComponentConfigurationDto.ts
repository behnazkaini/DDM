import { EmailOwnerFlag } from "./EmailOwnerFlag";

export interface EmailComponentConfigurationDto {
  ChangePersonalEmailPassword: boolean;
  Save: boolean;
  Delete: boolean;
  Load: boolean;
  OwnerFlag: EmailOwnerFlag;
}
