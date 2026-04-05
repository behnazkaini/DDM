import { Individual } from "./Chargoon.Didgah.Core5.Components.Models.SelectIndividual.Individual";

export interface SmsOutboxViewModel {
  SmsProviderID: number;
  Receiver: Individual;
  Message: string;
  ShowSenderName: boolean;
}
