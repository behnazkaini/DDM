import { ITreeNode } from "./Chargoon.Didgah.Core5.Components.Models.TreeEx.ITreeNode";
import { CategoryNodeMetadata } from "./Chargoon.Didgah.Common5.UI.Models.Category.CategoryNodeMetadata";

export interface CategoryNode {
  Children: ITreeNode<CategoryNodeMetadata>[];
  CssClass: string;
  DisableCheckbox: boolean;
  Disabled: boolean;
  DisableSelect: boolean;
  Hierarchy: string[];
  Icon: string;
  Id: string;
  IsLeaf: boolean;
  Metadata: CategoryNodeMetadata;
  ParentId: string;
  Text: string;
  Tooltip: string;
}
