import { TipOfTheDayImageViewModel } from "./Chargoon.Didgah.Common5.UI.Models.Admin.TipOfTheDay.TipOfTheDayImageViewModel";

export class TipOfTheDayViewModel {
  Id: number;
  Title: string;
  Description: string;
  Images: TipOfTheDayImageViewModel[] = [];
  SafeDescription: string;
  Chance: number;
  Guid: string;
}
