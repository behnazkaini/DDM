import { LayoutViewModel } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutViewModel";
import { LayoutItemType } from "../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType";
import { useMemo } from "react";
import {
  getFlatArrangementGroup,
  getParsedDesignValue,
} from "../services/widgetManager";
import { useAppSelector } from "../store/hook";
import { ArrangementType, NoneBindableTypeId } from "../../../typings/Core.DynamicDataModel/Enums";
import { Design, GroupHook, LayoutItemNoneBindableSetting } from "../../../typings/Core.DynamicDataModel/Types";
import useFloorStack from "./useFloorStack";
import { SimpleDesignerGlobalPropsContext } from "../store/reducers/designLayoutSlice";
import React from "react";

const useGroupSelector = () => {
  const globalProps = React.useContext(SimpleDesignerGlobalPropsContext);
  const { currentLayout, currentFloor } = useFloorStack({
    layoutGuid: globalProps.layoutGuid,
  });
  const { Count, StateVersion } = currentFloor;
  const DesignObj: Design = !!currentLayout
    ? (JSON.parse(currentLayout.Design) as Design)
    : ({ IsResponsive: false, Arrangement: [] } as Design);
  const FlatGroups = getFlatArrangementGroup(DesignObj);

  const layoutItemGroupFieldsets = !!currentLayout
    ? currentLayout.Items.filter((layoutItem) => {
        const layoutItemDesign = getParsedDesignValue(
          layoutItem
        ) as LayoutItemNoneBindableSetting;

        return (
          layoutItem.Type === LayoutItemType.NoneBindable &&
          layoutItemDesign.Widget.Id === NoneBindableTypeId.Fieldset
        );
      })
    : [];

  const layoutItemGroupTabs = !!currentLayout
    ? currentLayout.Items.filter((layoutItem) => {
        const layoutItemDesign = getParsedDesignValue(
          layoutItem
        ) as LayoutItemNoneBindableSetting;
        return (
          layoutItem.Type === LayoutItemType.NoneBindable &&
          layoutItemDesign.Widget.Id === NoneBindableTypeId.Tabs
        );
      })
    : [];

  const layoutItemGroupTabPane = !!currentLayout
    ? currentLayout.Items.filter((layoutItem) => {
        const layoutItemDesign = getParsedDesignValue(
          layoutItem
        ) as LayoutItemNoneBindableSetting;
        return (
          layoutItem.Type === LayoutItemType.NoneBindable &&
          layoutItemDesign.Widget.Id === NoneBindableTypeId.TabPane
        );
      })
    : [];

  const Tabs: GroupHook[] = useMemo(() => {
    const result: Array<GroupHook> = [];
    FlatGroups.forEach((groupItem) => {
      const Index = layoutItemGroupTabs.findIndex(
        (layoutItem) => layoutItem.Guid === groupItem.LayoutItemGuid
      );
      if (groupItem.Type === ArrangementType.NoneBindableGroup && Index > -1) {
        result.push({
          Item: groupItem,
          LayoutItem: layoutItemGroupTabs[Index],
        });
      }
    });

    return result;
  }, [Count.Group]);

  const TabPane: GroupHook[] = useMemo(() => {
    const result: Array<GroupHook> = [];
    FlatGroups.forEach((groupItem) => {
      const Index = layoutItemGroupTabPane.findIndex(
        (layoutItem) => layoutItem.Guid === groupItem.LayoutItemGuid
      );
      if (groupItem.Type === ArrangementType.NoneBindableGroup && Index > -1) {
        result.push({
          Item: groupItem,
          LayoutItem: layoutItemGroupTabPane[Index],
        });
      }
    });

    return result;
  }, [Count.Group]);

  const Fieldsets: GroupHook[] = useMemo(() => {
    const result: Array<GroupHook> = [];

    FlatGroups.forEach((groupItem) => {
      const Index = layoutItemGroupFieldsets.findIndex((layoutItem) => {
        return layoutItem.Guid === groupItem.LayoutItemGuid;
      });

      if (groupItem.Type === ArrangementType.NoneBindableGroup && Index > -1) {
        result.push({
          Item: groupItem,
          LayoutItem: layoutItemGroupFieldsets[Index],
        });
      }
    });

    return result;
  }, [Count.Group , StateVersion]);

  return {
    Tabs: [...Tabs],
    TabPane: [...TabPane],
    Fieldset: [...Fieldsets],
  };
};

export default useGroupSelector;
