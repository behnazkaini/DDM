import { eOwnerFlag } from "./Chargoon.Didgah.Common.Domain.Enumeration.eOwnerFlag";

export interface EmailAccountValidationQueryViewModel {
  EmailAccountID: number;
  EmailAddress: string;
  AutoSync: boolean;
  OwnerGuid: string;
  OwnerFlag: eOwnerFlag;
}
