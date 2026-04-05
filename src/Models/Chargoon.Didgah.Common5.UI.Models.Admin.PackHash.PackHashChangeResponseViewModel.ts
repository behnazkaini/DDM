import { HashChangeType } from "./Chargoon.Didgah.PackHash.Domain.Enumerations.HashChangeType";
import { HashScanType } from "./Chargoon.Didgah.PackHash.Domain.Enumerations.HashScanType";

export interface PackHashChangeResponseViewModel {
  Id: number;
  Path: string;
  OldPath: string;
  Action: HashChangeType;
  CreationTime: Date;
  ScanType: HashScanType;
  HostName: string;
}
