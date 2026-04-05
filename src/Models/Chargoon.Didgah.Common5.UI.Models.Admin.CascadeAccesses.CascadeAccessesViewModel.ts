export interface CascadeAccessesViewModel {
  Guid: string;
  Title: string;
  IsActive: boolean;
  AvailableUpperLevels: number;
  AvailableLowerLevels: number;
  SameLevelAvailable: boolean;
  AssociationGuid: string;
  AssociationTitle: string;
  AutoAssociationGuid: string;
  AutoAssociationTitle: string;
  IsAutoAssociation: boolean;
}
