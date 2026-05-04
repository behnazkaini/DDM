import { LayoutViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { useMemo } from "react";
import { getFlatArrangementGroup } from "../services/widgetManager";
import { useAppSelector } from "../store/hook";
import { Design, GroupItem, RowItem } from "../../../typings/Core.DynamicDataModel/Types";
import { SimpleDesignerGlobalPropsContext } from "../store/reducers/designLayoutSlice";
import useFloorStack from "./useFloorStack";
import React from "react";

const useRowSelector = (layoutItemGroupGuid: string) => {
  const globalProps = React.useContext(SimpleDesignerGlobalPropsContext);
  const { currentLayout, currentFloor } = useFloorStack({
    layoutGuid: globalProps.layoutGuid,
  });
  const { Count, StateVersion } = currentFloor;
  const DesignObj = JSON.parse(currentLayout.Design) as Design;
  const FlatGroups = getFlatArrangementGroup(DesignObj);

  const Row: Array<RowItem> = useMemo(() => {
    return (FlatGroups as Array<GroupItem>).find(
      (groupItem) =>
        groupItem.LayoutItemGuid.toLowerCase() ===
        layoutItemGroupGuid.toLowerCase()
    ).Children as RowItem[];
  }, [Count.Row, Count.Field]);
  return {
    Row,
  };
};

export default useRowSelector;
