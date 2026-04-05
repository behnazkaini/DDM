import { MetadataViewModel } from "./Chargoon.Didgah.Core5.Components.Models.TreeEx.MetadataViewModel";

export interface ITreeGetChildrenModel<TTreeMetadata, TNodeMetadata> {
  Id: string;
  Metadata: MetadataViewModel<TTreeMetadata, TNodeMetadata>;
}
