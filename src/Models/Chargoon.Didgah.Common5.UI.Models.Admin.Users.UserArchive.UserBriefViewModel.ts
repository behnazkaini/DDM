import { AuthenticationType } from "./Chargoon.Didgah.AuthenticationType";

export interface UserBriefViewModel {
  UserGuid: string;
  UserId: number;
  Deleted: boolean;
  IsOnline: boolean;
  Banned: boolean;
  AuthenticationType: AuthenticationType;
  UserName: string;
  FirstName: string;
  LastName: string;
  FullName: string;
  AccessZoneID: number;
  AccessZoneTitle: string;
  DefaultStaffTitle: string;
  LockedForever: boolean;
  LoginFailedCount: number;
  LastLockDate: Date;
  ActivityLimitationDate: Date;
  UserPolicies: string
}
