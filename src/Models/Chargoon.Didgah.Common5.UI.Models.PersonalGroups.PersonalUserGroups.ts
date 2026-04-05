import { Individual } from "./Chargoon.Didgah.Core5.Components.Models.SelectIndividual.Individual";

export interface PersonalUserGroups {
  Guid: string;
  OrderIndex: number;
  Title: string;
  AccessZoneTitle: string;
  Call: boolean;
  Chat: boolean;
  File: boolean;
  Sms: boolean;
  Message: boolean;
  Appointment: boolean;
  MediaMail: boolean;
  Members: Individual[];
}
