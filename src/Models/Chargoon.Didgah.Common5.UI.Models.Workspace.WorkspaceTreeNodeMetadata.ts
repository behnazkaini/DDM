import { WidgetViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Workspace.WidgetViewModel";

export interface WorkspaceTreeNodeMetadata {
  SoftwareGuid: string;
  Type: string;
  SingleInstance: boolean;
  SingleColor: boolean;
  Widgets: WidgetViewModel[];
}
