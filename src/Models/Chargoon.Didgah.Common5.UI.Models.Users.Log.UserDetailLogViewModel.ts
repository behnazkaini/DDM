import { UserHashTagLog } from "./Chargoon.Didgah.Common.Domain.Enumeration.UserHashTagLog";
import { IUserLogDetail } from "./Chargoon.Didgah.Common5.UI.Models.Users.Log.IUserLogDetail";

export interface UserDetailLogViewModel {
  UserFullName: string;
  Hour: string;
  Ip: string;
  ActionType: UserHashTagLog;
  Details: IUserLogDetail[];
}
