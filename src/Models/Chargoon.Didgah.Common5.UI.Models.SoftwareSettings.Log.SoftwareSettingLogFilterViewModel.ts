import { Individual } from "./Chargoon.Didgah.Core5.Components.Models.SelectIndividual.Individual";

export interface SoftwareSettingLogFilterViewModel {
  User: Individual;
  IpAddress: string;
  Timestamp: Date[];
  PageSize: number;
  PageNumber: number;
}
