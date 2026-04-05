import { AddressTypeViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Configuration.PersonAddressType.AddressTypeViewModel";

export interface AddressTypeSaveModel {
  Added: AddressTypeViewModel[];
  Edited: AddressTypeViewModel[];
  Deleted: AddressTypeViewModel[];
}
