import { GenericKeyValuePair } from "./Chargoon.Didgah.Common5.UI.Models.Admin.GenericKeyValuePair";

export interface LogTargetInitViewModel {
  TargetTypes: GenericKeyValuePair<number>[];
  SyslogProtocols: GenericKeyValuePair<number>[];
}
