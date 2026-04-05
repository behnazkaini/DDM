import { SoftwareAdmininstrationPanelCommandsModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Console.SoftwareAdmininstrationPanelCommandsModel";

export interface AdmininstrationPanelInfoViewModel {
  Commands: { [key: string]: SoftwareAdmininstrationPanelCommandsModel[]; };
  ShowBasicMobileAccessNotifyMessage: boolean;
}
