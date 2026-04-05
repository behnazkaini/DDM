import { TransportableItemOutboxStatus } from "./Chargoon.Didgah.Common.Domain.Enumeration.TransportableItemOutboxStatus";
import { LogOutboxFailureSource } from "./Chargoon.Didgah.Common.Domain.Enumeration.LogOutboxFailureSource";

export interface LogOutboxViewModel {
  ID: number;
  Status: TransportableItemOutboxStatus;
  RetryCount: number;
  TryTime: Date;
  FailureSource: LogOutboxFailureSource;
  FailureReason: string;
  ExtraInfo: string;
  FailureDetail: string;
}
