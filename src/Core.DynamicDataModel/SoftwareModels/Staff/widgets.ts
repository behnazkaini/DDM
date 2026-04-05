import { FieldTypeWidgets, IWidget } from "../../../typings/Core.DynamicDataModel/Types";
import { WidgetNames } from "./types";

const WidgetMap = {
    [("ba18cd70-d4fa-4706-a398-6de1e63633e0").toLowerCase()]: {
        "2": {
            Name: "Common_Staff_OneToOneAggregation",
            EditWidget: {
                "0": WidgetNames.StaffSelectorOneToOne,
            },
            DisplayWidget: {
                "0": WidgetNames.StaffDisplayOneToOne,
            },
        },
        "4":{
          name:"Common_Staff_OneToManyAggregation",
          EditWidget: {
            "0": WidgetNames.StaffSelectorOneToMany,
          },
          DisplayWidget: {
            "0": WidgetNames.StaffDisplayOneToMany,
          },
        }
    }
}
export default WidgetMap;