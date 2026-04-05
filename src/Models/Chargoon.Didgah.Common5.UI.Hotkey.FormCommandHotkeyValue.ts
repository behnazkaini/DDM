import { FormCommandHotkeyType } from "./Chargoon.Didgah.Common5.UI.Models.Hotkey.FormCommandHotkeyType";

export interface FormCommandHotkeyValue {
  Type: FormCommandHotkeyType;
  SoftwareGuid: string;
  SoftwareTitle: string;
  FormControlCode: string;
  FormTitle: string;
  Action: string;
  ActionTitle: string;
}
