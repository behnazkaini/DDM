import React, { useContext, useMemo } from 'react';
import {
  GlobalPropsContext,
} from "../../../store/reducers/designLayoutSlice";
import useFloorStack from '../../../hooks/useFloorStack';
import { LayoutItemType } from '../../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.Domain.Enumerations.LayoutItemType';
import { LayoutItemColumnViewModel } from '../../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.LayoutItemColumnViewModel';
import { SubLayoutItemViewModel } from '../../../../../Models/Chargoon.Didgah.Core.DynamicDataModel.BaseAPI.ViewModels.SubLayoutItemViewModel';

function useLayoutItems() {
  const globalProps = useContext(GlobalPropsContext);
  const { currentDataModel, currentLayout } = useFloorStack({
    layoutGuid: globalProps.layoutGuid,
  });

  const layoutItems = useMemo(() => {
    const columns = currentDataModel.Columns.map(col => {
      const layoutItem = currentLayout.Items.find(
        item => item.Type === LayoutItemType.Column &&
          (item as LayoutItemColumnViewModel).ColumnGuid === col.Guid
      );
      return {
        key: layoutItem ? JSON.parse(layoutItem.Design).Label as string : col.Label,
        value: col.Guid,
        Type: LayoutItemType.Column,
      };
    });

    const relations = currentDataModel.Relations.map(rel => {
      const layoutItem = currentLayout.Items.find(
        item => item.Type === LayoutItemType.SubLayout &&
          (item as SubLayoutItemViewModel).RelationGuid === rel.Guid
      );
      const getKey=()=>{
        if(layoutItem && layoutItem.Design) return JSON.parse(layoutItem.Design).Label as string
        else if(rel?.Label) return rel.Label
        else return ''
      }
      return {
        key: getKey(),
        value: rel.Guid,
        Type: LayoutItemType.Reference,
      };
    });

    return [...columns, ...relations];
  }, [currentDataModel.Columns, currentDataModel.Relations, currentLayout.Items]);

  return layoutItems;
}

export default useLayoutItems;
