import { DidgahDeferred } from "didgah/common";
import Fieldset from "./Fieldset";
import Tabs from "./Tabs";
import TabPane from "./TabPane";
import HelpBlock from "./helpBlock";

import { NoneBindableWidgetType } from "../../../typings/Core.DynamicDataModel/Enums";

const WIDGETS: { [name: string]: any } = {
  [NoneBindableWidgetType.Fieldset]: {
    component: Fieldset.component,
  },
  [NoneBindableWidgetType.Tabs]: {
    component: Tabs.component,
  },
  [NoneBindableWidgetType.TabPane]: {
    component: TabPane.component,
  },
  [NoneBindableWidgetType.HelpBlock]: {
    component: HelpBlock.component,
  },
};

const defaultWidget = {
  events: {
    onInit: (widgetId: string, attributes: object) => {
      const dfd = DidgahDeferred.create();
      dfd.resolve();
      return dfd.promise();
    },
  },
};

export default (id: string) => {
  return WIDGETS[id] && { ...defaultWidget, ...WIDGETS[id] };
};
