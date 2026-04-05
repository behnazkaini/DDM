

import { WidgetNames } from "../types";
import FileSelectorOneToOne from "./FileSelectorOneToOne";
import FileDisplayOneToOne from "./FileDisplayOneToOne";
import FileSelectorOneToMany from "./FileSelectorOneToMany";
import FileDisplayOneToMany from "./FileDisplayOneToMany";
import { IWidget } from "../../../../DynamicDataModel/definitions";

const WIDGETS: { [name: string]: IWidget } = {
	[WidgetNames.FileSelectorOneToOne]: {
		component: FileSelectorOneToOne,
	},
	[WidgetNames.FileDisplayOneToOne]: {
		component: FileDisplayOneToOne,
	},
	[WidgetNames.FileSelectorOneToMany]: {
		component: FileSelectorOneToMany,
	},
	[WidgetNames.FileDisplayOneToMany]: {
		component: FileDisplayOneToMany,
	},
}

export default (id: string) => {
	return WIDGETS[id] && { ...WIDGETS[id] };
};
