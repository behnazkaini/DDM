import { Individual } from "./Chargoon.Didgah.Core5.Components.Models.SelectIndividual.Individual";

export interface UserLogFilterViewModel {
  User: Individual;
  UserGuid: string;
  IpAddress: string;
  Timestamp: Date[];
  PageSize: number;
  PageNumber: number;
}
