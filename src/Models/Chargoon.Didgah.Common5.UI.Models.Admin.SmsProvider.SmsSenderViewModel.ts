import { Individual } from "./Chargoon.Didgah.Core5.Components.Models.SelectIndividual.Individual";

export interface SmsSenderViewModel {
  SmsProviderID: number;
  Receiver: Individual;
  Message: string;
  ShowSenderName: boolean;
}
