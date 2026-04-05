import { ObjectStatus } from "./Chargoon.Didgah.Common.Domain.Enumeration.ObjectStatus";

export interface ProxyMethodParameterViewModel {
  Guid: string;
  Key: string;
  Mapping: string;
  Status: ObjectStatus;
}
