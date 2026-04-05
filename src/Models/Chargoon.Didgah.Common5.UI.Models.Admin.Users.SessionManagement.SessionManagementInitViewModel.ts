import { ListItem } from "./Chargoon.Didgah.Core5.Components.Models.SelectEx.ListItem";

export interface SessionManagementInitViewModel {
  SessionStateListenKey: string;
  AllowedSessionCount: number;
  SessionFailureBehaviors: ListItem[];
  SelectedSessionFailureBehaviors: string;
  IsCurrentUser: boolean;
  IsUserBanned: boolean;
  CurrentUserSessionID: string;
}
