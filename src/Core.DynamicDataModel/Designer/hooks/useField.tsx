import { LayoutItemColumnViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel";
import * as React from "react";
import { ColumnViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.ColumnViewModel";
import { LayoutItemType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { GlobalPropsContext } from "../store/reducers/designLayoutSlice";
import useFloorStack from "./useFloorStack";

const UseField = () => {
  const [unusedFields, setUnusedFields] = React.useState<
    Array<ColumnViewModel>
  >([]);
  const globalProps = React.useContext(GlobalPropsContext);
  const { currentLayout, currentFloor, currentDataModel } = useFloorStack({
    layoutGuid: globalProps.layoutGuid,
  });
  const { Count, StateVersion } = currentFloor;
  
  React.useMemo(() => {
    const fieldGUIDs: string[] = currentDataModel.Columns.map((field) =>
      field.Guid.toLowerCase()
    );

    const itemGUIDs: string[] = !!currentLayout ?  currentLayout.Items.filter(
      (item) => item.Type === LayoutItemType.Column
    ).map((item: LayoutItemColumnViewModel) => item.ColumnGuid.toLowerCase()) : [];

    const unUsedFieldsGuid = fieldGUIDs.filter(
      (field) => !itemGUIDs.includes(field)
    );

    setUnusedFields(
      currentDataModel.Columns.filter((column) =>
        unUsedFieldsGuid.includes(column.Guid.toLowerCase())
      )
    );
  }, [Count.Field, StateVersion]);

  return [...unusedFields];
};

export default UseField;
