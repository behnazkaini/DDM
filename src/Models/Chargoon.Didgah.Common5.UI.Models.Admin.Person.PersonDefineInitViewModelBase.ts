import { PersonViewModelBase } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Person.PersonViewModelBase";
import { NationalityValidatorType } from "./Chargoon.Didgah.Common.Domain.Enumeration.NationalityValidatorType";
import { EncryptedGuidKeyValue } from "./Chargoon.Didgah.Common5.UI.Models.EncryptedGuidKeyValue";

export class PersonDefineInitViewModelBase<TPersonType extends PersonViewModelBase> {
  Person: TPersonType;
  PictureBase64: string;
  NativeNationality: string;
  NationalityValidatorType: NationalityValidatorType;
  Nationalities: EncryptedGuidKeyValue<string>[];
  AddressTypes: EncryptedGuidKeyValue<string>[];
  ContactTypes: EncryptedGuidKeyValue<string>[];
}
