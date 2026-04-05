import { UserSearchWithKeywordQueryViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Users.UserSearchWithKeywordQueryViewModel";

export interface PermissionGroupSelectUserRequestViewModel extends UserSearchWithKeywordQueryViewModel {
  TempObjectID: string;
  AccessZoneGuid: string;
}
