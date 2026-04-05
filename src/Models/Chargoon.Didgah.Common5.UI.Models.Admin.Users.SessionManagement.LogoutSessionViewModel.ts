import { SessionManagementBaseViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Users.SessionManagement.SessionManagementBaseViewModel";

export interface LogoutSessionViewModel extends SessionManagementBaseViewModel {
  UserGuid: string;
  SessionID: string;
}
