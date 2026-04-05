import { eOwnerFlag } from "./Chargoon.Didgah.Common.Domain.Enumeration.eOwnerFlag";

export interface EmailAccountLoadModel {
  EmailId: number;
  DisplayName: string;
  OwnerGuid: string;
  OwnerFlag: eOwnerFlag;
}
