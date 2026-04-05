import { UserGroupFlag } from "./Chargoon.Didgah.Common.Domain.Enumeration.UserGroupFlag";

export interface UserGroupMemberPagedRequestViewModel {
  TempObjectGuid: string;
  Flag: UserGroupFlag;
  SearchKeyword: string;
  PageSize: number;
  PageIndex: number;
}
