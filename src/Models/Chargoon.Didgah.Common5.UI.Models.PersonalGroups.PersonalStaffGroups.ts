import { Individual } from "./Chargoon.Didgah.Core5.Components.Models.SelectIndividual.Individual";

export interface PersonalStaffGroups {
  ID: number;
  OrderIndex: number;
  Title: string;
  Members: Individual[];
}
