import { PersonAddressSaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonAddressSaveViewModel";
import { PersonContactInfoSaveViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonContactInfoSaveViewModel";
import { PersonAttachmentViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonAttachmentViewModel";

export class PersonSaveViewModelBase {
  Guid: string;
  Active: boolean;
  DisplayName: string;
  Comments: string;
  PictureBase64: string;
  AdditionalIdentityCode: string;
  PrimaryWorkshopCode: number;
  SubWorkshopCode: number;
  DomainCode: string;
  NationalityGuid: string;
  Addresses: PersonAddressSaveViewModel[];
  ContactInfo: PersonContactInfoSaveViewModel[];
  DeletedAttachments: number[];
  AddedAttachments: PersonAttachmentViewModel[];
}
