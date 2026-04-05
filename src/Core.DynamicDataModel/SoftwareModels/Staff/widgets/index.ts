
import StaffDisplayOneToOne from "./staffDisplayOneToOne";
import StaffSelectorOneToOne from "./staffSelectorOneToOne";
import staffSelectorOneToMany from "./staffSelectorOneToMany";
import staffDisplayOnetoMany from "./staffDisplayOneToMany";
import { IWidget, WidgetNames } from "../types";

const WIDGETS: { [name: string]: IWidget } = {
    [WidgetNames.StaffDisplayOneToOne]: {
        component: StaffDisplayOneToOne,
    },
    [WidgetNames.StaffSelectorOneToOne]: {
        component: StaffSelectorOneToOne,
    },
    [WidgetNames.StaffSelectorOneToMany]: {
      component: staffSelectorOneToMany,
    },
    [WidgetNames.StaffDisplayOneToMany]: {
        component: staffDisplayOnetoMany,
    },
}

export default (id: string) => {
    return WIDGETS[id] && { ...WIDGETS[id] };
};
