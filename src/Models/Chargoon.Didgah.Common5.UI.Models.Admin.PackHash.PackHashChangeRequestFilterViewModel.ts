import { HashChangeType } from "./Chargoon.Didgah.PackHash.Domain.Enumerations.HashChangeType";
import { HashScanType } from "./Chargoon.Didgah.PackHash.Domain.Enumerations.HashScanType";

export interface PackHashChangeRequestFilterViewModel {
  DateFrom: Date;
  DateTo: Date;
  Extension: string;
  Name: string;
  Action: HashChangeType;
  ScanType: HashScanType;
}
