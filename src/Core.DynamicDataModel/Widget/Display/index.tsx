import { DisplayWidget } from "../../../typings/Core.DynamicDataModel/Enums";
import { DidgahDeferred } from "didgah/common";
import DateTimeViewer from "./dateTimeViewer";
import DateViewer from "./dateViewer";
import EmptyBlockViewer from "./emptyBlockViewer";
import Label from "./label";
import LabelDecimalWithSeperator from "./labelDecimalWithSeperator";
import LabelNumberWithSeperator from "./lableNumberWithSeperator";
import ReadonlyCheckBox from "./readonlyCheckbox";
import ReferenceAutoCompleteViewer from "./referenceAutoCompleteViewer";
import ReferenceTokenContainerViewer from "./referenceTokenContainerViewer";
import ReferenceArchiveViewer from "./referenceArchiveViewer";
import ReferenceDefineViewer from "./referenceDefineViewer";
import SwitchViewer from "./switchViewer";
import TimeViewer from "./timeViewer";
import { IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import UndefinedComponent from "../NoneBindable/UndefinedComponent";
import CascadeDropdown from './cascadeDropdown/index';

const WIDGETS: { [name: string]: IWidget } = {
  [DisplayWidget.Label]: {
    component: Label.component,
  },
  [DisplayWidget.ReadonlyCheckbox]: {
    component: ReadonlyCheckBox.component,
  },
  [DisplayWidget.DateViewer]: {
    component: DateViewer.component,
  },
  [DisplayWidget.TimeViewer]: {
    component: TimeViewer.component,
  },
  [DisplayWidget.DateTimeViewer]: {
    component: DateTimeViewer.component,
  },
  [DisplayWidget.EmptyBlockViewer]: {
    component: EmptyBlockViewer.component,
  },
  [DisplayWidget.LabelNumberWithSeperator]: {
    component: LabelNumberWithSeperator.component,
  },
  [DisplayWidget.LabelDecimalWithSeperator]: {
    component: LabelDecimalWithSeperator.component,
  },
  [DisplayWidget.ReferenceAutoCompleteViewer]: {
    component: ReferenceAutoCompleteViewer.component,
  },
  [DisplayWidget.ReferenceTokenContainerViewer]: {
    component: ReferenceTokenContainerViewer.component,
  },
  [DisplayWidget.ReferenceDefineViewer]: {
    component: ReferenceDefineViewer.component,
  },
  [DisplayWidget.ReferenceArchiveViewer]: {
    component: ReferenceArchiveViewer.component,
  },
  [DisplayWidget.SwitchViewer]: {
    component: SwitchViewer.component,
  },
  [DisplayWidget.CascadeDropdown]: {
    component: CascadeDropdown.component,
  },
  [DisplayWidget.UndefinedComponent]: {
    component: UndefinedComponent.component,
  }
};

export default (id: string) => {
  return WIDGETS[id] && { ...WIDGETS[id] };
};
