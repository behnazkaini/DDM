import { Controls } from "./Chargoon.Didgah.Common.Domain.Enumeration.Controls";
import { ConsoleInitTokenType } from "./Chargoon.Didgah.Common.Domain.Enumeration.ConsoleInitTokenType";

export interface ConsoleInitTokenViewModel {
  Token: string;
  ControlCode: Controls;
  TokenType: ConsoleInitTokenType;
}
