import { ITreeNode } from "./Chargoon.Didgah.Core5.Components.Models.TreeEx.ITreeNode";
import { WebServiceTreeNodeMetaData } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.WebServiceTreeNodeMetaData";

export interface WebServiceTreeNode {
  Id: string;
  ParentId: string;
  Text: string;
  Hierarchy: string[];
  Children: ITreeNode<WebServiceTreeNodeMetaData>[];
  Icon: string;
  IsLeaf: boolean;
  Disabled: boolean;
  Metadata: WebServiceTreeNodeMetaData;
  DisableCheckbox: boolean;
  Tooltip: string;
  CssClass: string;
  DisableSelect: boolean;
}
