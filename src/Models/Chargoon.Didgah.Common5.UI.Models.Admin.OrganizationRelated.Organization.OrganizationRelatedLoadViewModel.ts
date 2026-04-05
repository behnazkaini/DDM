import { ReceiverServerType } from "./Chargoon.Didgah.Common.Domain.Enumeration.ReceiverServerType";
import { OrganizationNature } from "./Chargoon.Didgah.Common.Domain.Enumeration.OrganizationNature";
import { LinkType } from "./Chargoon.Didgah.Common.Domain.Enumeration.LinkType";
import { BodyFileReceivingType } from "./Chargoon.Didgah.Common.Domain.Enumeration.BodyFileReceivingType";
import { BodyFileImageReceivingType } from "./Chargoon.Didgah.Common.Domain.Enumeration.BodyFileImageReceivingType";
import { Individual } from "./Chargoon.Didgah.Core5.Components.Models.SelectIndividual.Individual";
import { WebServiceLiteViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.ManageWebService.WebServiceLiteViewModel";
import { LinkServerSenderEmailType } from "./Chargoon.Didgah.Common.Domain.Enumeration.LinkServerSenderEmailType";

export interface OrganizationRelatedLoadViewModel {
  Id: number;
  Guid: string;
  Title: string;
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
  DepartmentGuid: string;
  BodyFileReceivingType: BodyFileReceivingType;
  BodyFileImageReceivingType: BodyFileImageReceivingType;
  PeopleTitleDisplay: string;
  HasLinkServerInfo: boolean;
  Contact: Individual;
  Trusted: boolean;
  WebServiceInfo: WebServiceLiteViewModel;
  EmailAccountId: string;
  SenderEmailType: LinkServerSenderEmailType;
}
