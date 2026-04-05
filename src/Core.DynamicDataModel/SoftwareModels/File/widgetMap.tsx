
import { WidgetNames } from "./types";

const WidgetMap = {
	[("7C1FCA75-961A-4150-88D3-FEFC2FD7A430").toLowerCase()]: {
		"2": {
			Name: "Common_File_OneToOneAggregation",
			EditWidget: {
				"0": WidgetNames.FileSelectorOneToOne,
			},
			DisplayWidget: {
				"0": WidgetNames.FileDisplayOneToOne,
			},
		},
		"4": {
			Name: "Common_File_OneToManyAggregation",
			EditWidget: {
				"0": WidgetNames.FileSelectorOneToMany,
			},
			DisplayWidget: {
				"0": WidgetNames.FileDisplayOneToMany,
			},
		},
	}
}

export default WidgetMap;