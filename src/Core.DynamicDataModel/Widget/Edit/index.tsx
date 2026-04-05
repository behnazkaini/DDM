import { IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { DidgahDeferred } from "didgah/common";
import Checkbox from "./checkbox";
import CommaSeparablecomboBox from "./commaSeparableComboBox";
import DatePicker from "./datePicker";
import DateTimePicker from "./datetimePicker";
import Email from "./email";
import EmptyBlock from "./emptyBlock";
import HelpBlock from "../NoneBindable/helpBlock";
import InputDecimal from "./inputDecimal";
import InputDecimalWithSeperator from "./inputDecimalWithSeperator";
import InputNumber from "./inputNumber";
import InputNumberWithSeperator from "./inputNumberWithSeperator";
import InputHotkey from "./inputHotkey";
import Switch from "./switch";
import Textarea from "./textarea";
import Textbox from "./textbox";
import TimePicker from "./timePicker";
import Url from "./url";
import ReferenceAutoComplete from "./referenceAutoComplete";
import ReferenceTokenContainer from "./referenceTokenContainer";
import ReferenceArchive from "./referenceArchive";
import ReferenceDefine from "./referenceDefine";
import CommaSeparableNumberComboBox from "./CommaSeparableNumberComboBox";
import { DisplayWidget, EditWidget } from "../../../typings/Core.DynamicDataModel/Enums";
import UndefinedComponent from "../NoneBindable/UndefinedComponent";
import cascadeDropdown from "./cascadeDropdown/index";

const WIDGETS: { [name: string]: IWidget } = {
  [EditWidget.TextBox]: {
    component: Textbox.component,
  },
  [EditWidget.TextArea]: {
    component: Textarea.component,
  },
  [EditWidget.Email]: {
    component: Email.component,
  },
  [EditWidget.URL]: {
    component: Url.component,
  },
  [EditWidget.CommaSeparableComboBox]: {
    component: CommaSeparablecomboBox.component,
  },
  [EditWidget.Checkbox]: {
    component: Checkbox.component,
  },
  [EditWidget.Switch]: {
    component: Switch.component,
  },
  [EditWidget.InputNumber]: {
    component: InputNumber.component,
  },
  [EditWidget.InputNumberWithSeperator]: {
    component: InputNumberWithSeperator.component,
  },
  [EditWidget.DatePicker]: {
    component: DatePicker.component,
  },
  [EditWidget.TimePicker]: {
    component: TimePicker.component,
  },
  [EditWidget.DateTimePicker]: {
    component: DateTimePicker.component,
  },
  [EditWidget.InputDecimal]: {
    component: InputDecimal.component,
  },
  [EditWidget.InputDecimalWithSeperator]: {
    component: InputDecimalWithSeperator.component,
  },
  [EditWidget.EmptyBlock]: {
    component: EmptyBlock.component,
  },
  [EditWidget.HelpBlock]: {
    component: HelpBlock.component,
  },
  [EditWidget.ReferenceAutoComplete]: {
    component: ReferenceAutoComplete.component,
  },
  [EditWidget.ReferenceTokenContainer]: {
    component: ReferenceTokenContainer.component,
  },
  [EditWidget.ReferenceArchive]: {
    component: ReferenceArchive.component,
  },
  [EditWidget.ReferenceDefine]: {
    component: ReferenceDefine.component,
  },
  [EditWidget.CommaSeparableNumberComboBox]: {
    component: CommaSeparableNumberComboBox.component,
  },
  [DisplayWidget.UndefinedComponent]: {
    component: UndefinedComponent.component,
  },
  [EditWidget.CascadeDropdown]: {
    component: cascadeDropdown.component,
  },
  [EditWidget.InputHotkey]: {
    component: InputHotkey.component,
  }
};

export default (id: string) => {
  return WIDGETS[id] && { ...WIDGETS[id] };
};