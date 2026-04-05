import { UserGroupFlag } from "./Chargoon.Didgah.Common.Domain.Enumeration.UserGroupFlag";

export interface UserGroupTitleAvailableViewModel {
  Guid: string;
  Title: string;
  OwnerId: number;
  Flag: UserGroupFlag;
}
