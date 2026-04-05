export interface ITreeNode<TMetadata> {
  Id: string;
  ParentId: string;
  Text: string;
  Hierarchy: string[];
  Children: ITreeNode<TMetadata>[];
  Icon: string;
  IsLeaf: boolean;
  Disabled: boolean;
  Metadata: TMetadata;
  DisableCheckbox: boolean;
  Tooltip: string;
  CssClass: string;
  DisableSelect: boolean;
}
