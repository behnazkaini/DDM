import { DTSProcessStatus } from "./Chargoon.Didgah.Common.Domain.DataModel.DTSProcessStatus";

export class DTSProcessBrief {
  Guid: string;
  SoftwareGuid: string;
  Creator: string;
  SoftwareTitleKey: string;
  PackageTitleKey: string;
  StartDate: Date;
  Status: DTSProcessStatus;
}
