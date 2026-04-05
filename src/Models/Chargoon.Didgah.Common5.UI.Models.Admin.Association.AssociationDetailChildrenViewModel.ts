import { AssociationDetailTreeNode } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Association.AssociationDetailTreeNode";

export interface AssociationDetailChildrenViewModel {
  AssociationDetailsTempGuid: string;
  Children: AssociationDetailTreeNode[];
  ParentID: string;
}
