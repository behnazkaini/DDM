import { Action } from "./Chargoon.Didgah.Common5.UI.Models.Person.Interaction.Action";
import { PhoneNumber } from "./Chargoon.Didgah.Common5.UI.Models.Person.Interaction.PhoneNumber";

export interface Call extends Action {
  Numbers: PhoneNumber[];
}
