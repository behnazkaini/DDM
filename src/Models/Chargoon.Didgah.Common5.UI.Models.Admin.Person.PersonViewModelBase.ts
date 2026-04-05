import { ExtensionLiteItemModel } from "./Chargoon.Didgah.Common5.UI.Models.ExtensionLiteItemModel";
import { PersonLogViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonLogViewModel";
import { PersonAddressViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonAddressViewModel";
import { PersonConnectionViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonConnectionViewModel";
import { PersonContactInfoViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonContactInfoViewModel";

export class PersonViewModelBase {
  Id: number;
  Guid: string;
  NationalityGuid: string;
  Active: boolean;
  DisplayName: string;
  Nationality: string;
  AdditionalIdentityCode: string;
  Comments: string;
  DomainCode: string;
  Attachments: ExtensionLiteItemModel[];
  Logs: PersonLogViewModel[];
  Addresses: PersonAddressViewModel[];
  Connections: PersonConnectionViewModel[];
  ContactInfo: PersonContactInfoViewModel[];
}
