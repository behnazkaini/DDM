export interface SoftwareAdmininstrationPanelCommandsModel {
  ControlCode: number;
  TitleKey: string;
  CommandParameters: Object;
  SoftwareGuid: string;
  ChildCommands: SoftwareAdmininstrationPanelCommandsModel[];
}
