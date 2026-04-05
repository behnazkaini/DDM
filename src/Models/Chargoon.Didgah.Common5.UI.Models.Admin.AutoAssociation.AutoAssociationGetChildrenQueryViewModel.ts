import { ITreeGetChildrenModel } from "./Chargoon.Didgah.Core5.Components.Models.TreeEx.ITreeGetChildrenModel";
import { AutoAssociationGetChildrenViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.AutoAssociation.AutoAssociationGetChildrenViewModel";
import { Metadata } from "./Chargoon.Didgah.Common5.UI.Models.Admin.AutoAssociation.Metadata";
import { MetadataViewModel } from "./Chargoon.Didgah.Core5.Components.Models.TreeEx.MetadataViewModel";

export interface AutoAssociationGetChildrenQueryViewModel {
  Id: string;
  Metadata: MetadataViewModel<AutoAssociationGetChildrenViewModel, Metadata>;
  StaffId: number;
}
