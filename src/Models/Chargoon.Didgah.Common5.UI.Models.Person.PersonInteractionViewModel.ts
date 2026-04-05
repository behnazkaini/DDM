import { Action } from "./Chargoon.Didgah.Common5.UI.Models.Person.Interaction.Action";

export interface PersonInteractionViewModel {
  Guid: string;
  Name: string;
  Staffs: string[];
  BinaryAvatar: number[];
  Avatar: string;
  Actions: Action[];
}
