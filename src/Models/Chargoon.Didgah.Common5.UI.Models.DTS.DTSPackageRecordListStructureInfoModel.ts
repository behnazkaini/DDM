import { DidgahDTSRecordListInfo } from "./Chargoon.Didgah.Common.Domain.Service.DidgahDTSRecordListInfo";
import { DidgahDTSFieldInfo } from "./Chargoon.Didgah.Common.Domain.Service.DidgahDTSFieldInfo";

export interface DTSPackageRecordListStructureInfoModel {
  DTSRecordListInfo: DidgahDTSRecordListInfo;
  DidgahDTSFieldInfos: DidgahDTSFieldInfo[];
}
