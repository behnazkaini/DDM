import { ObjectStatus } from "./Chargoon.Didgah.Common.Domain.Enumeration.ObjectStatus";

export interface ProxyMethodErrorMappingViewModel {
  Guid: string;
  Key: string;
  Mapping: string;
  Condition: string;
  Priority: number;
  IsDefault: boolean;
  Status: ObjectStatus;
}
