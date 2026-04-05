import { ReceiverServerType } from "./Chargoon.Didgah.Common.Domain.Enumeration.ReceiverServerType";
import { OrganizationNature } from "./Chargoon.Didgah.Common.Domain.Enumeration.OrganizationNature";
import { LinkType } from "./Chargoon.Didgah.Common.Domain.Enumeration.LinkType";
import { BodyFileReceivingType } from "./Chargoon.Didgah.Common.Domain.Enumeration.BodyFileReceivingType";
import { BodyFileImageReceivingType } from "./Chargoon.Didgah.Common.Domain.Enumeration.BodyFileImageReceivingType";
import { LinkServerSenderEmailType } from "./Chargoon.Didgah.Common.Domain.Enumeration.LinkServerSenderEmailType";

export interface OrganizationRelatedSaveViewModel {
  Id: number;
  ContactId: number;
  Guid: string;
  Title: string;
  PeopleDisplayTitle: string;
  LinkServerEmail: string;
  LinkServerUrl: string;
  Email: string;
  Telephone: string;
  Description: string;
  OrderIndex: number;
  RelatedOrganizationTypeGuid: string;
  OrganizationCode: string;
  ReceiverServerType: ReceiverServerType;
  OrganizationNature: OrganizationNature;
  LinkType: LinkType;
  OrganizationGuid: string;
  BodyFileReceivingType: BodyFileReceivingType;
  BodyFileImageReceivingType: BodyFileImageReceivingType;
  UpdateRelatedPeopleDisplayTitle: boolean;
  Trusted: boolean;
  WebserviceGuid: string;
  EmailAccountId: number;
  SenderEmailType: LinkServerSenderEmailType;
}
