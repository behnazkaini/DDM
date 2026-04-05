import { HotkeyActionType } from "./Chargoon.Didgah.Global.HotkeyActionType";
import { HotkeyCode } from "./Chargoon.Didgah.Global.HotkeyCode";
import { ModifierKey } from "./Chargoon.Didgah.Global.ModifierKey";
import { HotkeyStatus } from "./Chargoon.Didgah.Common5.UI.Models.Hotkey.HotkeyStatus";

export interface HotkeyItemModel {
  Id?: string;
  ActionType: HotkeyActionType;
  KeyCode: HotkeyCode;
  Modifier: ModifierKey;
  Value: string;
  Title: string;
  HasChange: boolean;
  ReadOnly: boolean;
  Status: HotkeyStatus;
  ValueDescripton: string;
}
