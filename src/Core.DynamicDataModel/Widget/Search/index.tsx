
import { IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { DisplayWidget, EditWidget, SearchWidget } from "../../../typings/Core.DynamicDataModel/Enums";
import Textbox from "../Edit/textbox";
import InputNumber from "../Edit/inputDecimal";
import DateTimePicker from "../Edit/datetimePicker";
import InputDecimal from "../Edit/inputDecimal";
import Checkbox from "../Edit/checkbox";
import UndefinedComponent from "../NoneBindable/UndefinedComponent";

const WIDGETS: { [name: string]: IWidget } = {
    [EditWidget.TextBox]: {
        component: Textbox.component,
    },
    [EditWidget.Checkbox]: {
        component: Checkbox.component,
    },
    [EditWidget.InputNumber]: {
        component: InputNumber.component,
    },

    [EditWidget.DateTimePicker]: {
        component: DateTimePicker.component,
    },
    [EditWidget.InputDecimal]: {
        component: InputDecimal.component,
    },
    [DisplayWidget.UndefinedComponent]: {
        component: UndefinedComponent.component,
    }
};

export default (id: string) => {
    return WIDGETS[id] && { ...WIDGETS[id] };
};
