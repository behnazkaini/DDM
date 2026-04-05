import { LinkType } from "./Chargoon.Didgah.Common.Domain.Enumeration.LinkType";

export interface OrganizationRelatedDepartmentLoadViewModel {
  ID: number;
  OrganizationID: number;
  DepartmentGuid: string;
  ParentGuid: string;
  Guid: string;
  Title: string;
  Email: string;
  Telephone: string;
  Description: string;
  OrderIndex: number;
  Hierarchy: string;
  LinkServerEmail: string;
  LinkServerUrl: string;
  LinkType: LinkType;
  GuidHierarchy: string;
  HasLinkServerInfo: boolean;
}
