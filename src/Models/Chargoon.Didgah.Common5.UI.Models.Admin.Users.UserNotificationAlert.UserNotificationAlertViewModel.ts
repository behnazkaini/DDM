import { NotificationType } from "./Chargoon.Didgah.Common.Domain.Enumeration.NotificationType";

export interface UserNotificationAlertViewModel {
  Id: string;
  Title: string;
  NotificationType: NotificationType;
  Checked: boolean;
}
