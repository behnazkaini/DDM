import { ServerMobileSoftwareDto } from "./Chargoon.Didgah.Common.Domain.Dto.MobileSoftware.ServerMobileSoftwareDto";

export interface SaveSettingResultViewModel {
  Result: boolean;
  Message: string;
  ErrorData: ServerMobileSoftwareDto[];
}
