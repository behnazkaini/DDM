import { ITreeNode } from "./Chargoon.Didgah.Core5.Components.Models.TreeEx.ITreeNode";

export interface AssociationDetailTreeNode {
  Id: string;
  ParentId: string;
  Text: string;
  Hierarchy: string[];
  Children: ITreeNode<Object>[];
  Kids: AssociationDetailTreeNode[];
  Icon: string;
  IsLeaf: boolean;
  Disabled: boolean;
  Metadata: Object;
  DisableCheckbox: boolean;
  Tooltip: string;
  CssClass: string;
  DisableSelect: boolean;
}
