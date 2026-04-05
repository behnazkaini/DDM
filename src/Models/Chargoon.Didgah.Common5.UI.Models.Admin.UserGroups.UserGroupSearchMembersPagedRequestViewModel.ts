import { UserSearchWithKeywordQueryViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Users.UserSearchWithKeywordQueryViewModel";
import { UserGroupFlag } from "./Chargoon.Didgah.Common.Domain.Enumeration.UserGroupFlag";

export interface UserGroupSearchMembersPagedRequestViewModel extends UserSearchWithKeywordQueryViewModel {
  TempObjectGuid: string;
  UserGroupGuid: string;
  Flag: UserGroupFlag;
}
