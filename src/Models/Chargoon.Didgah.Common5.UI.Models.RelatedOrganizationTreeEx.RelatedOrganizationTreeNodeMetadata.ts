import { RelatedOrganizationNodeType } from "./Chargoon.Didgah.Common.Domain.Enumeration.RelatedOrganizationNodeType";

export interface RelatedOrganizationTreeNodeMetadata {
  ID: string;
  Guid: string;
  Type: RelatedOrganizationNodeType;
  IsLinked: boolean;
  Default: boolean;
  IsEditable: boolean;
  RelatedOrganizationTypeAccessZoneGuid: string;
}
